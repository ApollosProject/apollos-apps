import { NativeModules as RNNativeModules } from 'react-native';

RNNativeModules.UIManager = {
  RCTView: () => ({
    directEventTypes: {},
  }),
};

RNNativeModules.KeyboardObserver = {};
RNNativeModules.RNGestureHandlerModule = {
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
  State: {},
  Directions: {},
};
RNNativeModules.ApollosPlayer = {
  isPictureInPictureSupported: jest.fn(),
};
