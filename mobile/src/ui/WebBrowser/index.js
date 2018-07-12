// Provider API for WebBrowser that injects theme values and defaults to the web browser:
import { createContext } from 'react';

import { withTheme } from 'ui/theme';

import Browser from './Browser';

const { Provider: BaseProvider, Consumer } = createContext(Browser.openURL);

const Provider = withTheme(({ theme }) => ({
  value: (url, options = {}) =>
    Browser.openURL(url, {
      tintColor: theme.colors.primary,
      barTintColor: theme.colors.background.paper,
      ...options,
    }),
}))(BaseProvider);

export default Browser;
export { Provider as WebBrowserProvider, Consumer as WebBrowserConsumer };
