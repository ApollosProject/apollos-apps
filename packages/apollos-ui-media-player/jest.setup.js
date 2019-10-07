jest.mock('@apollosproject/ui-analytics', () => ({
  track: () => '',
  AnalyticsProvider: ({ children }) => children,
}));

jest.mock('@apollosproject/react-native-airplay-btn', () => ({
  AirPlayButton: () => 'AirPlayButton',
}));

jest.mock('../apollos-ui-kit/node_modules/react-native-safe-area-context/', () => ({
  SafeAreaConsumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
}));

jest.mock('react-native-music-control', () => ({
  enableBackgroundMode: jest.fn(),
  enableControl: jest.fn(),
  on: jest.fn(),
  setNowPlaying: jest.fn(),
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
