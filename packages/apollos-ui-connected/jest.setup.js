import React from 'react';
import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';
import 'react-native-gesture-handler/jestSetup';

ApollosConfig.loadJs({ FRAGMENTS });

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

jest.mock('@react-native-community/datetimepicker', () => 'DatePicker');

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
