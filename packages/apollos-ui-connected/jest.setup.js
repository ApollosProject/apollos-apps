import React from 'react';
import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';
import { Animated } from 'react-native';

import { fragmentTypes } from '@apollosproject/ui-test-utils';

const TYPEMAP = fragmentTypes.__schema.types.reduce((acc, curr) => {
  const { name } = curr;
  const types = curr.possibleTypes
    .map((type) => [type.name, name])
    .reduce((accum, [n, t]) => {
      accum[n] = t; // eslint-disable-line
      return accum;
    }, {});
  Object.keys(types).forEach((key) => {
    acc[key] = acc[key] ? [...acc[key], types[key]] : [types[key]];
  });
  return acc;
}, {});

ApollosConfig.loadJs({ FRAGMENTS, TYPEMAP });

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

jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsConsumer: ({ children }) => children({ test: jest.fn() }),
  AnalyticsProvider: ({ children }) => children,
  TrackEventWhenLoaded: () => null,
  withTrackOnPress: (Component) => (props) => <Component {...props} />,
}));
