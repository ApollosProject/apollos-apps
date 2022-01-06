import URL from 'url';
import querystring from 'querystring';
import React, { Component } from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { withApollo } from '@apollo/client/react/hoc';
import { get } from 'lodash';
import OneSignal from 'react-native-onesignal';
import ApollosConfig from '@apollosproject/config';

import PushProvider from './pushProvider';
import updatePushId from './updatePushId';

const APP_ID = ApollosConfig.ONESIGNAL_APP_ID || ApollosConfig.ONE_SIGNAL_KEY;

const GET_PUSH_ID = gql`
  query {
    pushId @client
  }
`;

class NotificationsInit extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    navigate: PropTypes.func.isRequired,
    client: PropTypes.shape({
      mutate: PropTypes.func,
      addResolvers: PropTypes.func,
      writeQuery: PropTypes.func,
      readQuery: PropTypes.func,
      onClearStore: PropTypes.func,
    }).isRequired,
    actionMap: PropTypes.shape({}),
    handleExternalLink: PropTypes.func,
  };

  static defaultProps = {
    actionMap: {},
  };

  static navigationOptions = {};

  constructor(props) {
    super(props);
    const { client } = props;
    client.writeQuery({
      query: GET_PUSH_ID,
      data: {
        pushId: null,
      },
    });
    client.onClearStore(() =>
      client.writeQuery({
        query: GET_PUSH_ID,
        data: {
          pushId: null,
        },
      })
    );
  }

  async componentDidMount() {
    // One Signal 4.x
    if (OneSignal.setAppId && APP_ID) {
      OneSignal.setAppId(APP_ID);
      OneSignal.setNotificationWillShowInForegroundHandler(this.onReceived);
      OneSignal.setNotificationOpenedHandler(this.onOpened);

      const deviceState = await OneSignal.getDeviceState();
      this.onIds(deviceState);
    } else if (APP_ID) {
      // backup, for OneSignal 3.x
      OneSignal.init(APP_ID, {
        kOSSettingsKeyAutoPrompt: false,
      });
      OneSignal.addEventListener('received', this.onReceived);
      OneSignal.addEventListener('opened', this.onOpenedV3);
      OneSignal.addEventListener('ids', this.onIds);
      OneSignal.setSubscription(true);
    }

    Linking.getInitialURL().then((url) => {
      this.navigate(url);
    });
    Linking.addEventListener('url', ({ url }) => this.navigate(url));
  }

  componentWillUnmount() {
    Linking.removeEventListener('url');
    if (APP_ID) {
      // v4
      if (OneSignal.clearHandlers) {
        OneSignal.clearHandlers();
        // v3
      } else {
        OneSignal.removeEventListener('received');
        OneSignal.removeEventListener('opened');
        OneSignal.removeEventListener('ids');
      }
    }
  }

  navigate = (rawUrl) => {
    if (!rawUrl) return;
    // this is the long term solution
    if (this.props.handleExternalLink) {
      this.props.handleExternalLink(rawUrl);
      return;
    }
    // TODO, leave in for backwards compatibility but long term,
    // should use the prop above
    const url = URL.parse(rawUrl);
    const route = url.pathname.substring(1);
    const cleanedRoute = route.includes('/app-link/')
      ? route
      : route.split('app-link/')[1];
    const args = querystring.parse(url.query);
    this.props.navigate(cleanedRoute, args);
  };

  onReceived = (notification) => {
    console.log('Notification received: ', notification);
  };

  onOpened = (openResult) => {
    const url = openResult.notification.additionalData?.url;
    if (
      openResult.action.actionID &&
      this.props.actionMap[openResult.action.actionID]
    ) {
      this.props.actionMap[openResult.action.actionID](
        openResult.notification.additionalData
      );
    } else if (url) {
      this.navigate(url);
    }
  };

  onOpenedV3 = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    // URL looks like this
    // apolloschurchapp://AppStackNavigator/Connect
    // apolloschurchapp://SomethingElse/Connect
    // apolloschurchapp://SomethingElse/ContentSingle?itemId=SomeItemId:blablalba
    const url = get(openResult, 'notification.payload.additionalData.url');
    if (
      openResult?.action?.actionID &&
      this.props.actionMap[openResult.action.actionID]
    ) {
      this.props.actionMap[openResult.action.actionID](
        openResult.notification.payload.additionalData
      );
    } else if (url) {
      this.navigate(url);
    }
  };

  onIds = (device) => {
    this.props.client.writeQuery({
      query: gql`
        query {
          pushId @client
        }
      `,
      data: {
        pushId: device.userId,
      },
    });
    const { isLoggedIn } = this.props.client.readQuery({
      query: gql`
        query {
          isLoggedIn @client
        }
      `,
    });
    if (isLoggedIn) {
      updatePushId({ pushId: device.userId, client: this.props.client });
    }
  };

  render() {
    return <PushProvider>{this.props.children}</PushProvider>;
  }
}

export default withApollo(NotificationsInit);
