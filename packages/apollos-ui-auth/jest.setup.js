import { NativeModules } from 'react-native';

jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsProvider: ({ children }) => children,
}));

NativeModules.RNGestureHandlerModule = {};
NativeModules.StatusBarManager = {
  ...NativeModules.StatusBarManager,
  getHeight: () => 64,
};

// jest.mock('@react-native-community/datetimepicker', () => 'DatePicker');
