import { Config } from '@apollosproject/config';
import LiveDataSource from '../data-source';

const defaults = {
  CHURCH_ONLINE: {
    URL: 'https://apollos.churchonline.org/api/v1/',
    MEDIA_URLS: ['https://example.org/video.mp4'],
  },
};

describe('The Church Online datasource', () => {
  it('must fetch a list of livestreams', async () => {
    const liveStream = new LiveDataSource();

    const getActiveLiveStreamContent = jest.fn(async () =>
      Promise.resolve([{ id: '123' }])
    );

    const config = new Config();
    config.loadJs(defaults);

    liveStream.context = {
      dataSources: {
        ContentItem: {
          getActiveLiveStreamContent,
        },
        Config: config,
      },
    };

    liveStream.getLiveStream = async () => ({
      isLive: true,
    });

    const result = await liveStream.getLiveStreams();

    expect(result).toMatchSnapshot();
    expect(getActiveLiveStreamContent.mock.calls).toMatchSnapshot();
  });
});
