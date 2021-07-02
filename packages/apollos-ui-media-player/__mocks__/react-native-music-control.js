export const Command = {};

export default {
  enableBackgroundMode: jest.fn(),
  enableControl: jest.fn(),
  stopControl: jest.fn(),
  setNowPlaying: jest.fn(),
  on: jest.fn(),
  updatePlayback: jest.fn(),
  handleAudioInterruptions: jest.fn(),
};
