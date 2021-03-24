import { nest } from 'recompose';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from './theme';
import { LayoutProvider } from './LayoutContext';

export default nest(LayoutProvider, ThemeProvider, BottomSheetModalProvider);
