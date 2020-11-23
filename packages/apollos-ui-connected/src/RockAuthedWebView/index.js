// Provider API for WebBrowser that injects theme values and defaults to the web browser:
import React from 'react';
import gql from 'graphql-tag';
import { Query } from '@apollo/client/react/components';
import { ModalView } from '@apollosproject/ui-kit';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

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

const RockAuthedWebView = ({ url, navigation, route }) => {
  return (
    <Query query={GET_USER_COOKIE}>
      {({ data, loading }) => {
        if (loading) {
          return null;
        }
        return (
          <Browser
            cookie={data?.currentUser?.rock?.authCookie ?? ''}
            url={route?.params?.url ?? url}
            modal={route?.params?.modal ?? false}
            navigation={navigation}
          />
        );
      }}
    </Query>
  );
};

RockAuthedWebView.propTypes = {
  url: PropTypes.string,
  route: PropTypes.shape({
    params: PropTypes.shape({ url: PropTypes.string, modal: PropTypes.bool }),
  }),
};

export default RockAuthedWebView;
