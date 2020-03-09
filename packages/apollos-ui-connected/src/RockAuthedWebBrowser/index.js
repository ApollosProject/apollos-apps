// Provider API for WebBrowser that injects theme values and defaults to the web browser:
import { Platform } from 'react-native';
import { withApollo } from 'react-apollo';

import { withTheme } from '@apollosproject/ui-kit';

import RockAuthedInAppBrowser from './RockAuthedWebBrowser';

const RockAuthedWebBrowserWithClient = ({ children, client, themeColors }) =>
  children((url, iABOptions = {}, authOptions = {}) =>
    RockAuthedInAppBrowser.open(
      url,
      {
        client,
        ...Platform.select({
          ios: {
            dismissButtonStyle: 'cancel',
            preferredBarTintColor: themeColors.paper,
            preferredControlTintColor: themeColors.primary,
            readerMode: false,
          },
          android: {
            toolbarColor: themeColors.paper,
            enableDefaultShare: true,
            showTitle: true,
            secondaryToolbarColor: 'black',
            enableUrlBarHiding: true,
            forceCloseOnRedirection: false,
          },
        }),
        ...iABOptions,
      },
      authOptions
    )
  );

const RockAuthedWebBrowser = withApollo(
  withTheme(
    ({ theme: { colors: themeColors = {} } = {} }) => ({
      themeColors,
    }),
    'ui-connected.RockAuthedWebBrowser'
  )(RockAuthedWebBrowserWithClient)
);

export default RockAuthedWebBrowser;
