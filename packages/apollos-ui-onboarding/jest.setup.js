import React from 'react';
import { NativeModules } from 'react-native';
import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';

ApollosConfig.loadJs({ FRAGMENTS });

jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsProvider: ({ children }) => children,
  AnalyticsConsumer: ({ children }) => children({ track: jest.fn() }),
  withTrackOnPress: (Component) => (props) => <Component {...props} />,
}));

jest.mock('react-native-geolocation-service', () => ({}));

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

jest.mock('@apollosproject/ui-connected', () => ({
  FollowListConnected: require.requireActual('@apollosproject/ui-kit')
    .FollowList,
}));
