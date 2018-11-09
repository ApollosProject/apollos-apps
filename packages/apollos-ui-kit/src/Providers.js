import { nest } from 'recompose';

import { ThemeProvider } from './theme';
import { WebBrowserProvider } from './WebBrowser';
import { LayoutProvider } from './LayoutContext';

export default nest(ThemeProvider, WebBrowserProvider, LayoutProvider);
