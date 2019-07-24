import fetchMoreResolver from '../fetchMoreResolver';
import testUtils from '../testUtils';

describe('the fetchMoreResolver function', () => {
  const args = {
    collectionName: 'userFeed',
    variables: { first: 10, after: null },
    fetchMore: jest.fn(),
    data: {
      userFeed: {
        edges: [
          {
            0: { node: { id: 'node0' } },
          },
          {
            1: { node: { id: 'node0' } },
          },
        ],
        pageInfo: { endCursor: 'node123' },
      },
    },
  };
  test('it returns undefined when no endCursor', () => {
    expect(
      fetchMoreResolver({
        data: { userFeed: { edges: [], pageInfo: {} } },
        ...args,
      })()
    ).toBeUndefined();
  });
});
