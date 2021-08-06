import ApollosConfig from '@apollosproject/config';
import { dataSource as BinaryFilesDataSource } from '../index';

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
