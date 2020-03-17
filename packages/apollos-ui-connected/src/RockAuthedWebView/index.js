// Provider API for WebBrowser that injects theme values and defaults to the web browser:
import React, { createContext } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ModalView } from '@apollosproject/ui-kit';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import { get } from 'lodash';

const Browser = ({ url, cookie, modal, navigation }) => {
  if (modal) {
    return (
      <ModalView navigation={navigation} onClose={() => navigation.pop()}>
        <WebView source={{ uri: url, headers: { Cookie: cookie } }} />
      </ModalView>
    );
  }
  return <WebView source={{ uri: url, headers: { Cookie: cookie } }} />;
};

Browser.propTypes = {
  url: PropTypes.string.isRequired,
  cookie: PropTypes.string,
  modal: PropTypes.bool.isRequired,
};

const GET_USER_COOKIE = gql`
  query UserToken {
    currentUser {
      id
      rock {
        authCookie
      }
    }
  }
`;

const RockAuthedWebView = ({ url, navigation }) => {
  // get the url from the navigation param or default to the url prop;
  const uri = navigation.getParam('url', url);
  const modal = navigation.getParam('modal', false);
  return (
    <Query query={GET_USER_COOKIE}>
      {({ data, loading }) => {
        if (loading) {
          return null;
        }
        const cookie = get(data, 'currentUser.rock.authCookie', '');
        return (
          <Browser
            cookie={cookie}
            url={uri}
            modal={modal}
            navigation={navigation}
          />
        );
      }}
    </Query>
  );
};

RockAuthedWebView.propTypes = {
  url: PropTypes.string,
};

RockAuthedWebView.navigationOptions = ({ navigation, navigationOptions }) => ({
  header: navigation.getParam('modal', false) ? null : navigationOptions.header,
});

const OpenWebView = ({ url, navigation }) =>
  navigation.navigate('RockAuthedWebView', { url });

const WebViewContext = createContext(OpenWebView);

export default RockAuthedWebView;
export { GET_USER_COOKIE, WebViewContext, OpenWebView };
