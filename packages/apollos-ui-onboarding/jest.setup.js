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

jest.mock('@react-navigation/native', () => {
  const ActualNavigation = require.requireActual('@react-navigation/native');
  return {
    ...ActualNavigation,
    SafeAreaView: require.requireActual('SafeAreaView'),
  };
});

jest.mock('DatePickerIOS', () => 'DatePicker');

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
