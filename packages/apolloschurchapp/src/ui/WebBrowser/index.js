// Provider API for WebBrowser that injects theme values and defaults to the web browser:
import { Platform } from 'react-native';
import { createContext } from 'react';
import gql from 'graphql-tag';

import { withTheme } from '@apollosproject/ui-kit';

import { client } from '../../client';
import Browser from './Browser';

export const GET_USER_COOKIE = gql`
  query CurrentUserCookie {
    currentUser {
      id
      rockToken
    }
  }
`;

export const getCookie = () => {
  const {
    data: { currentUser: { rockToken } = {} } = {},
    loading,
  } = client.readQuery({
    query: GET_USER_COOKIE,
  });
  if (loading) return {};
  return rockToken;
};

const { Provider: BaseProvider, Consumer } = createContext(Browser.open);

const Provider = withTheme(({ theme }) => ({
  value: (url, headers = {}, options = {}) => {
    const cookie = getCookie();
    return Browser.open(url, {
      ...Platform.select({
        ios: {
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: theme.colors.background.paper,
          preferredControlTintColor: theme.colors.primary,
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'overFullScreen',
          modalTransitionStyle: 'partialCurl',
          modalEnabled: true,
        },
        android: {
          toolbarColor: theme.colors.background.paper,
          enableDefaultShare: true,
          showTitle: true,
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          forceCloseOnRedirection: false,
        },
      }),
      ...cookie,
      ...headers,
      ...options,
    });
  },
}))(BaseProvider);

export default Browser;
export { Provider as WebBrowserProvider, Consumer as WebBrowserConsumer };
