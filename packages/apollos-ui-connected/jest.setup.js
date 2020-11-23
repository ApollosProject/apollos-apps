import React from 'react';
import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';
// import 'react-native-gesture-handler/jestSetup';
import { Animated } from 'react-native';

ApollosConfig.loadJs({ FRAGMENTS });

// jest.mock('Image', () => ({
//   ...require.requireActual('Image'),
//   getSize: (_, cb) => cb(500, 600),
// }));

Animated.timing = (value, config) => ({
  start: (callback) => {
    value.setValue(config.toValue);
    callback && callback({ finished: true });
  },
  stop: () => ({}),
});
Animated.spring = (value, config) => ({
  start: (callback) => {
    value.setValue(config.toValue);
    callback && callback({ finished: true });
  },
  stop: () => ({}),
});

// jest.mock('@react-native-community/datetimepicker', () => 'DatePicker');

jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsConsumer: ({ children }) => children({ test: jest.fn() }),
  AnalyticsProvider: ({ children }) => children,
  TrackEventWhenLoaded: () => null,
  withTrackOnPress: (Component) => (props) => <Component {...props} />,
}));
