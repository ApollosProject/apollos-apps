// Provider API for WebBrowser that injects theme values and defaults to the web browser:
import { Platform } from 'react-native';
import { withApollo } from 'react-apollo';

import { withTheme } from '@apollosproject/ui-kit';

import RockAuthedInAppBrowser from './RockAuthedWebBrowser';

const RockAuthedWebBrowserWithClient = ({ children, client, paper, primary }) =>
  children((url, headers = {}, options = {}) =>
    RockAuthedInAppBrowser.open(url, {
      client,
      ...Platform.select({
        ios: {
          // dismissButtonStyle: 'cancel',
          // preferredBarTintColor: paper,
          // preferredControlTintColor: primary,
          // readerMode: false,
          // animated: true,
          // modalPresentationStyle: 'overFullScreen',
          // modalTransitionStyle: 'partialCurl',
          // modalEnabled: true,
        },
        android: {
          // toolbarColor: paper,
          // enableDefaultShare: true,
          // showTitle: true,
          // secondaryToolbarColor: 'black',
          // enableUrlBarHiding: true,
          // forceCloseOnRedirection: false,
        },
      }),
      headers: { ...headers },
      ...options,
    })
  );

const RockAuthedWebBrowser = withApollo(
  withTheme(({ theme: { colors: { paper, primary } = {} } = {} }) => ({
    paper,
    primary,
  }))(RockAuthedWebBrowserWithClient)
);

export default RockAuthedWebBrowser;
