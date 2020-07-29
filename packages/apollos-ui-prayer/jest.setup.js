// import React from 'react';
import { NativeModules } from 'react-native';
// import ApollosConfig from '@apollosproject/config';
// import FRAGMENTS from '@apollosproject/ui-fragments';

// ApollosConfig.loadJs({ FRAGMENTS });

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaConsumer: ({ children }) =>
    children({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
}));

// jest.mock('../../node_modules/@metarouter/analytics-react-native', () => ({
jest.mock('@metarouter/analytics-react-native', () => ({
  track: jest.fn(),
  setup: jest.fn(),
}));

// jest.mock('react-navigation', () => {
//   const ActualNavigation = require.requireActual('react-navigation');
//   return {
//     ...ActualNavigation,
//     SafeAreaView: require.requireActual('SafeAreaView'),
//   };
// });

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
