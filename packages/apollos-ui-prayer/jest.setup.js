import { Animated } from 'react-native';

jest.mock('@metarouter/analytics-react-native', () => ({
  track: jest.fn(),
  setup: jest.fn(),
}));

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

jest.mock('@react-native-community/datetimepicker', () => 'DatePicker');
