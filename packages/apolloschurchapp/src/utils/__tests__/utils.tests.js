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
  // TODO is it possible fetchMore functionality???
});

test('renderWithApolloData renders the component', async () => {
  const tree = await renderWithApolloData(<Text>hello, world!</Text>);
  expect(tree).toMatchSnapshot();
});
