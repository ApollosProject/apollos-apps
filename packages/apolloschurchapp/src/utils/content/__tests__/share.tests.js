import { Platform, Share } from 'react-native';
import share from '../share';

jest.mock('Platform');
jest.mock('Share');

describe('the share function', () => {
  beforeAll(() => {
    // we don't need to test the functionality of Share.share(),
    // only that our args are being sent properly
    Share.share = jest.fn((args) => {
      throw new Error(JSON.stringify(args));
    });
  });
  test('default arguments', () => {
    Platform.OS = 'ios';
    expect(() => share({ title: 'title', url: 'http://url.com' })).toThrow(
      JSON.stringify({
        title: 'title',
        message: 'title',
        url: 'http://url.com',
      })
    );
  });
  test('android arguments', () => {
    Platform.OS = 'android';
    expect(() => share({ title: 'title', url: 'http://url.com' })).toThrow(
      JSON.stringify({
        title: 'title',
        message: 'title\nhttp://url.com',
        url: 'http://url.com',
      })
    );
  });
});
