import { nest } from 'recompose';

import { ThemeProvider } from '/mobile/ui/theme';
import ClientProvider from '/mobile/client';
import { WebBrowserProvider } from '/mobile/ui/WebBrowser';

export default nest(ClientProvider, ThemeProvider, WebBrowserProvider);
