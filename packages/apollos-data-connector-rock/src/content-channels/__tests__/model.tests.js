import ApollosConfig from '@apollosproject/config';
import { buildGetMock } from '../../test-utils';
import ContentChannelDataSource from '../data-source';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
  ROCK_MAPPINGS: {
    DISCOVER_CONTENT_CHANNEL_IDS: [3, 1, 8],
  },
});

describe('ContentChannelModel', () => {
  it('constructs', () => {
    expect(new ContentChannelDataSource()).toBeTruthy();
  });
  it('gets all', () => {
    const dataSource = new ContentChannelDataSource();
    dataSource.get = buildGetMock([{ Id: 1 }, { Id: 2 }], dataSource);
    const result = dataSource.all();
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('gets channels in the given order', () => {
    const dataSource = new ContentChannelDataSource();
    dataSource.get = buildGetMock(
      [{ Id: 3 }, { Id: 1 }, { Id: 8 }],
      dataSource
    );
    const result = dataSource.getRootChannels();
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('gets by id', () => {
    const dataSource = new ContentChannelDataSource();
    dataSource.get = buildGetMock([{ Id: 1 }], dataSource);
    const result = dataSource.getFromId(1);
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });
});
