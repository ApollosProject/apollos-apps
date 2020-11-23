// import React from 'react';
import { NativeModules } from 'react-native';
// import ApollosConfig from '@apollosproject/config';
// import FRAGMENTS from '@apollosproject/ui-fragments';

// ApollosConfig.loadJs({ FRAGMENTS });

// jest.mock('@react-navigation/native', () => {
//   const ActualNavigation = require.requireActual('@react-navigation/native');
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

jest.mock('Animated', () => {
  const ActualAnimated = require.requireActual('Animated');
  return {
    ...ActualAnimated,
    timing: (value, config) => ({
      start: (callback) => {
        value.setValue(config.toValue);
        callback && callback({ finished: true });
      },
      stop: () => ({}),
    }),
    spring: (value, config) => ({
      start: (callback) => {
        value.setValue(config.toValue);
        callback && callback({ finished: true });
      },
      stop: () => ({}),
    }),
  };
});

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
