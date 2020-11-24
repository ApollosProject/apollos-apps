import { NativeModules as RNNativeModules } from 'react-native';

RNNativeModules.UIManager = {
  RCTView: () => ({
    directEventTypes: {},
  }),
  RCTVideo: {
    Constants: {
      ScaleToFill: 1,
      ScaleAspectFit: 2,
      ScaleAspectFill: 2,
      ScaleNone: 0,
    },
  },
};

RNNativeModules.MusicControlManager = {
  STATE_PLAYING: 'STATE_PLAYING',
  STATE_PAUSED: 'STATE_PAUSED',
  STATE_ERROR: 'STATE_ERROR',
  STATE_STOPPED: 'STATE_STOPPED',
  STATE_BUFFERING: 'STATE_BUFFERING',
  RATING_HEART: 'RATING_HEART',
  RATING_THUMBS_UP_DOWN: 'RATING_THUMBS_UP_DOWN',
  RATING_3_STARS: 'RATING_3_STARS',
  RATING_4_STARS: 'RATING_4_STARS',
  RATING_5_STARS: 'RATING_5_STARS',
  RATING_PERCENTAGE: 'RATING_PERCENTAGE',
};

RNNativeModules.KeyboardObserver = {};
RNNativeModules.ApollosPlayer = {
  // eslint-disable-next-line no-undef
  isPictureInPictureSupported: jest.fn(),
};
