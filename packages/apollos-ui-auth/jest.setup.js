import { NativeModules } from 'react-native';

jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsProvider: ({ children }) => children,
}));

NativeModules.RNGestureHandlerModule = {};

jest.mock('@react-native-community/datetimepicker', () => 'DatePicker');
