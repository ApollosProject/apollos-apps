// Provider API for WebBrowser that injects theme values and defaults to the web browser:
import { Platform } from 'react-native';
import { withApollo } from '@apollo/client/react/hoc';

import { withTheme } from '@apollosproject/ui-kit';

import RockAuthedInAppBrowser from './RockAuthedWebBrowser';

const RockAuthedWebBrowserWithClient = ({ children, client, paper, primary }) =>
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
        ...iABOptions,
      },
      authOptions
    )
  );

const RockAuthedWebBrowser = withApollo(
  withTheme(
    ({ theme: { colors: { paper, primary } = {} } = {} }) => ({
      paper,
      primary,
    }),
    'ui-connected.RockAuthedWebBrowser'
  )(RockAuthedWebBrowserWithClient)
);

export default RockAuthedWebBrowser;
