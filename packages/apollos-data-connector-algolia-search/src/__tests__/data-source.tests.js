import { times } from 'lodash';
import Search from '../data-source';

describe('The algolia search dataSource', () => {
  it('must be able to perform a full index of data from the ContentItem dataSource', async () => {
    const search = new Search();

    const ContentItem = {
      paginate: jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            edges: times(100, (i) => ({
              node: { id: i },
              cursor: `${i}-cursor`,
            })),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            edges: times(50, (i) => ({
              node: { id: i },
              cursor: `${i}-cursor`,
            })),
          })
        ),
      byActive: jest.fn(() => 'by-active-cursor'),
    };
    search.context = { dataSources: { ContentItem } };
    search.mapItemToAlgolia = jest.fn(() => [
      { objectID: 'bla', title: 'Some Item', summary: 'bar' },
    ]);

    await search.indexAll();
    expect(ContentItem.byActive.mock.calls).toMatchSnapshot();
    expect(ContentItem.paginate.mock.calls).toMatchSnapshot();
    expect(search.mapItemToAlgolia.mock.calls).toMatchSnapshot();
    expect(search.index.clearIndex.mock.calls).toMatchSnapshot();
  });

  it('must raise an error if the indexing fails', () => {
    const search = new Search();

    const ContentItem = {
      paginate: jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            edges: times(100, (i) => ({
              node: { id: i },
              cursor: `${i}-cursor`,
            })),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            edges: times(50, (i) => ({
              node: { id: i },
              cursor: `${i}-cursor`,
            })),
          })
        ),
      byActive: jest.fn(() => 'by-active-cursor'),
    };
    search.context = { dataSources: { ContentItem } };
    search.mapItemToAlgolia = jest.fn(() => [
      { objectID: 'bla', title: 'Some Item', summary: 'bar' },
    ]);

    search.index.addObjects = (data, cb) => cb(new Error('Indexing error'));

    expect(search.indexAll()).rejects.toMatchSnapshot();
  });
});
