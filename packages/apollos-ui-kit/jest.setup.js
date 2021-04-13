import { NativeModules } from 'react-native';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-screens/native-stack', () => ({
  createNativeStackNavigator: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  const Easing = {
    exp: jest.fn(),
    out: jest.fn(),
  };

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  Reanimated.Easing = Easing;
  Reanimated.EasingNode = Easing;

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.mock(
  'react-native/Libraries/Components/DatePicker/DatePickerIOS',
  () => 'DatePicker'
);

NativeModules.RNGestureHandlerModule = {
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
  forceTouchAvailable: jest.fn(),
  State: {},
  Directions: {},
};
