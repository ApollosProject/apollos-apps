import React from 'react';
import PropTypes from 'prop-types';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Themer } from './theme';
import { LayoutProvider } from './LayoutContext';

const Providers = ({ theme, themeInput, icons, iconInput, children }) => (
  <ActionSheetProvider>
    <LayoutProvider>
      <Themer theme={theme || themeInput} icons={icons || iconInput}>
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      </Themer>
    </LayoutProvider>
  </ActionSheetProvider>
);

Providers.propTypes = {
  theme: PropTypes.shape({}),
  icons: PropTypes.shape({}),
  children: PropTypes.shape({}),
  // deprecated
  themeInput: PropTypes.shape({}),
  iconInput: PropTypes.shape({}),
};

export default Providers;
