import { NativeModules } from 'react-native';

jest.mock('react-native-safe-area-context/', () => ({
  SafeAreaConsumer: ({ children }) =>
    children({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
}));

NativeModules.RNGestureHandlerModule = {
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
  forceTouchAvailable: jest.fn(),
  State: {},
  Directions: {},
};

jest.mock('@react-native-community/datetimepicker', () => 'DatePicker');
