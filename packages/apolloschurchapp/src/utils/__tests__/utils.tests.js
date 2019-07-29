import React from 'react';
import { Text } from 'react-native';
import fetchMoreResolver from '../fetchMoreResolver';
import { renderWithApolloData } from '../testUtils';

describe('the fetchMoreResolver function', () => {
  const args = {
    collectionName: 'userFeed',
    variables: { first: 10, after: null },
    fetchMore: jest.fn(),
    data: {
      userFeed: {
        edges: [
          {
            0: { node: { id: 'foo' } },
          },
          {
            1: { node: { id: 'bar' } },
          },
        ],
        pageInfo: { endCursor: 'abc123' },
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
  test('it appends data properly', () => {
    fetchMoreResolver({ ...args })();
    const previousResult = args.data;
    const fetchMoreResult = {
      userFeed: {
        edges: [{ 0: { node: { id: 'baz' } } }],
        pageInfo: { endCursor: 'def456' },
      },
    };
    // console.log(
    // args.fetchMore.mock.calls[1][0].updateQuery(previousResult, {
    // fetchMoreResult,
    // }).userFeed.edges
    // );
    expect(
      args.fetchMore.mock.calls[1][0].updateQuery(previousResult, {
        fetchMoreResult,
      })
    ).toEqual({
      userFeed: {
        edges: [
          {
            0: { node: { id: 'foo' } },
          },
          {
            1: { node: { id: 'bar' } },
          },
          {
            2: { node: { id: 'baz' } },
          },
        ],
        pageInfo: { endCursor: 'def456' },
      },
    });
  });
});

test('renderWithApolloData renders the component', async () => {
  const tree = await renderWithApolloData(<Text>hello, world!</Text>);
  expect(tree).toMatchSnapshot();
});
