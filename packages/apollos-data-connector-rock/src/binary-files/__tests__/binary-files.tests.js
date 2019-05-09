import ApollosConfig from '@apollosproject/config';
import { dataSource as BinaryFilesDataSource, resolver } from '../index';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
});

describe('BinaryFiles', () => {
  it("uploads a user's profile picture", async () => {
    const dataSource = new BinaryFilesDataSource();
    dataSource.nodeFetch = jest.fn(() =>
      Promise.resolve({ text: () => '245' })
    );

    const result = await dataSource.uploadFile(
      { stream: '123', filename: 'something.jpg' },
      456
    );
    expect(result).toMatchSnapshot();
    const nodeFetchCalls = dataSource.nodeFetch.mock.calls;
    // Remove randomly generated multipart boundary.
    nodeFetchCalls[0][1].body._boundary = nodeFetchCalls[0][1].body._boundary.replace(
      /\d+/,
      ''
    );
    nodeFetchCalls[0][1].body._streams[0] = nodeFetchCalls[0][1].body._streams[0].replace(
      /\d+/,
      ''
    );
    nodeFetchCalls[0][1].headers['content-type'] = nodeFetchCalls[0][1].headers[
      'content-type'
    ].replace(/\d+/, '');
    expect(nodeFetchCalls).toMatchSnapshot();
  });
});

describe('Binary files resolver', () => {
  it('returns a url if the person object has a url', async () => {
    const BinaryFiles = new BinaryFilesDataSource();
    BinaryFiles.get = jest.fn(() =>
      Promise.resolve({ url: 'https://example.com/1.jpg' })
    );
    const result = await resolver.Person.photo(
      {
        photo: {
          id: 123,
          url: 'http://alreadyhere.com/1.jpg',
        },
      },
      null,
      { dataSources: { BinaryFiles } }
    );
    expect(result).toMatchSnapshot();
    expect(BinaryFiles.get.mock.calls).toMatchSnapshot();
  });
  it('returns a url if the person object has a id', async () => {
    const BinaryFiles = new BinaryFilesDataSource();
    BinaryFiles.get = jest.fn(() =>
      Promise.resolve({ url: 'https://example.com/1.jpg' })
    );
    const result = await resolver.Person.photo(
      {
        photo: {
          id: 123,
        },
      },
      null,
      { dataSources: { BinaryFiles } }
    );
    expect(result).toMatchSnapshot();
    expect(BinaryFiles.get.mock.calls).toMatchSnapshot();
  });
  it('returns null with no image', async () => {
    const BinaryFiles = new BinaryFilesDataSource();
    BinaryFiles.get = jest.fn(() =>
      Promise.resolve({ url: 'https://example.com/1.jpg' })
    );
    const result = await resolver.Person.photo(
      {
        photo: {},
      },
      null,
      { dataSources: { BinaryFiles } }
    );
    expect(result).toMatchSnapshot();
    expect(BinaryFiles.get.mock.calls).toMatchSnapshot();
  });
});
