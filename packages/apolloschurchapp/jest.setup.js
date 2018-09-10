jest.mock('./src/client/index');
jest.mock('react-native-custom-tabs', () => ({
  CustomTabs: {
    openURL: jest.fn(),
  },
}));

jest.mock('react-native-safari-view', () => ({
  isAvailable: jest.fn().mockImplementation(() => Promise.resolve(true)),
  show: jest.fn(),
}));

jest.mock('react-native-music-control', () => ({
  enableBackgroundMode: jest.fn(),
  enableControl: jest.fn(),
  on: jest.fn(),
  setNowPlaying: jest.fn(),
}));

jest.mock('react-native-device-info');

jest.mock('react-native-video', () => 'Video');
