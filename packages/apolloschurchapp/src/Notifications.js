import { Component } from 'react';
import { Linking, Platform } from 'react-native';
import OneSignal from 'react-native-onesignal';
import { withNavigation } from 'react-navigation';
import { ONE_SIGNAL_KEY } from './config';

class NotificationsInit extends Component {
  static navigationOptions = {};

  componentWillMount() {
    OneSignal.init(ONE_SIGNAL_KEY, {
      kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then((url) => {
        this.navigate(url);
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  handleOpenURL = (event) => {
    this.navigate(event.url);
  };

  navigate = (url) => {
    const { navigate } = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^]+)\/?$/)[1];
    const routeName = route.split('/')[0];

    if (routeName === 'AppStackNavigator') {
      navigate('AppStackNavigator', { id });
    } else if (routeName === 'Tabs') {
      navigate('Tabs');
    } else if (routeName === 'ContentSingle') {
      navigate('ContentSingle', { id });
    } else if (routeName === 'Connect') {
      navigate('Connect');
    }
  };

  onReceived = (notification) => {
    console.log('Notification received: ', notification);
  };

  onOpened = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  };

  onIds = (device) => {
    console.log('Device info: ', device);
  };

  render() {
    return null;
  }
}

export default withNavigation(NotificationsInit);
