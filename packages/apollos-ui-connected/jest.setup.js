import React from 'react';
import { NativeModules } from 'react-native';
import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';

ApollosConfig.loadJs({ FRAGMENTS });

// We ran into an issue where SafeAreaView would break jest tests.
jest.mock(
  '../apollos-ui-kit/node_modules/react-native-safe-area-context/',
  () => ({
    SafeAreaConsumer: ({ children }) =>
      children({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaProvider: ({ children }) => children,
  })
);

jest.mock('Image', () => ({
  ...require.requireActual('Image'),
  getSize: (_, cb) => cb(500, 600),
}));

jest.mock('Animated', () => {
  const ActualAnimated = require.requireActual('Animated');
  return {
    ...ActualAnimated,
    timing: (value, config) => ({
      start: (callback) => {
        value.setValue(config.toValue);
        callback && callback();
      },
      stop: () => ({}),
    }),
    spring: (value, config) => ({
      start: (callback) => {
        value.setValue(config.toValue);
        callback && callback();
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
  State: {},
  Directions: {},
};

jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsConsumer: ({ children }) => children({ test: jest.fn() }),
  AnalyticsProvider: ({ children }) => children,
  TrackEventWhenLoaded: () => null,
  withTrackOnPress: (Component) => (props) => <Component {...props} />,
}));

jest.mock('@apollosproject/ui-media-player', () => ({
  MediaPlayerSpacer: ({ children }) => children,
  MediaPlayer: () => 'MediaPlayer',
  MediaPlayerProvider: ({ children }) => children,
  playVideoMutation: 'mutation { playVideo }',
  withTabBarMediaSpacer: () => ({ children }) => children,
}));
