import { dataSource as ConfigDataSource } from '@apollosproject/config';
import { dataSource as BinaryFilesDataSource } from '../index';

describe('BinaryFiles', () => {
  it("uploads a user's profile picture", async () => {
    const dataSource = new BinaryFilesDataSource();
    const configDataSource = new ConfigDataSource();
    configDataSource.initialize({
      context: { church: { slug: 'apollos_demo' } },
    });
    dataSource.context = { dataSources: { Config: configDataSource } };

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
    nodeFetchCalls[0][1].body._boundary =
      nodeFetchCalls[0][1].body._boundary.replace(/\d+/, '');
    nodeFetchCalls[0][1].body._streams[0] =
      nodeFetchCalls[0][1].body._streams[0].replace(/\d+/, '');
    nodeFetchCalls[0][1].headers['content-type'] = nodeFetchCalls[0][1].headers[
      'content-type'
    ].replace(/\d+/, '');
    expect(nodeFetchCalls).toMatchSnapshot();
  });
});
