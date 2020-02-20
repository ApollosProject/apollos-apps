// Provider API for WebBrowser that injects theme values and defaults to the web browser:
import { Platform } from 'react-native';
import { withApollo } from 'react-apollo';

import { withTheme } from '@apollosproject/ui-kit';

import RockAuthedInAppBrowser from './RockAuthedWebBrowser';

const RockAuthedWebBrowserWithClient = ({
  children,
  client,
  paper,
  primary,
  browserOptions,
}) =>
  children((url, iABOptions = {}, authOptions = {}) =>
    RockAuthedInAppBrowser.open(
      url,
      {
        client,
        ...Platform.select({
          ios: {
            dismissButtonStyle: 'cancel',
            preferredBarTintColor: paper,
            preferredControlTintColor: primary,
            readerMode: false,
          },
          android: {
            toolbarColor: paper,
            enableDefaultShare: true,
            showTitle: true,
            secondaryToolbarColor: 'black',
            enableUrlBarHiding: true,
            forceCloseOnRedirection: false,
          },
        }),
        ...Platform.select(browserOptions),
        ...iABOptions,
      },
      authOptions
    )
  );

const RockAuthedWebBrowser = withApollo(
  withTheme(
    ({
      theme: { colors: { paper, primary } = {}, browserOptions = {} } = {},
    }) => ({
      paper,
      primary,
      browserOptions,
    })
  )(RockAuthedWebBrowserWithClient)
);

export default RockAuthedWebBrowser;
