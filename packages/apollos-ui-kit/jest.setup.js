import * as reactNative from 'react-native';

jest.mock(
  'react-native/Libraries/Components/DatePicker/DatePickerIOS',
  () => 'DatePicker'
);

reactNative.NativeModules.RNGestureHandlerModule = {
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
  forceTouchAvailable: jest.fn(),
  State: {},
  Directions: {},
};

reactNative.useColorScheme = jest.fn();