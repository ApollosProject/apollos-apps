import React from 'react';
import renderer from 'react-test-renderer';
import { View } from 'react-native';
import { Providers, renderWithApolloData } from '../testUtils';

import getContentUpNext from './getContentUpNext';

import UpNextButtonConnected from '.';

const noChildrenMock = {
  request: {
    query: getContentUpNext,
    variables: { nodeId: '1' },
  },
  result: {
    data: {
      node: {
        id: '1',
        __typename: 'ContentSeriesContentItem',
        upNext: null,
        childContentItemsConnection: {
          edges: [],
        },
      },
    },
  },
};

const finishedMock = {
  request: {
    query: getContentUpNext,
    variables: { nodeId: '1' },
  },
  result: {
    data: {
      node: {
        id: '1',
        __typename: 'ContentSeriesContentItem',
        upNext: null,
        childContentItemsConnection: {
          __typename: 'ContentItemsConnection',
          edges: [
            {
              node: { id: '2', __typename: 'UniversalContentItem' },
              __typename: 'ContentItemsConnectionEdge',
            },
          ],
        },
      },
    },
  },
};

const upNextMock = {
  request: {
    query: getContentUpNext,
    variables: { nodeId: '1' },
  },
  result: {
    data: {
      node: {
        id: '1',
        __typename: 'ContentSeriesContentItem',
        upNext: { id: '2', __typename: 'UniversalContentItem' },
        childContentItemsConnection: {
          __typename: 'ContentItemsConnection',
          edges: [
            {
              node: { id: '2', __typename: 'UniversalContentItem' },
              __typename: 'ContentItemsConnectionEdge',
            },
          ],
        },
      },
    },
  },
};

const upNextNoChildrenMock = {
  request: {
    query: getContentUpNext,
    variables: { nodeId: '1' },
  },
  result: {
    data: {
      node: {
        id: '1',
        __typename: 'ContentSeriesContentItem',
        upNext: { id: '2', __typename: 'UniversalContentItem' },
        childContentItemsConnection: {
          __typename: 'ContentItemsConnection',
          edges: [
            {
              node: { id: '2', __typename: 'UniversalContentItem' },
              __typename: 'ContentItemsConnectionEdge',
            },
          ],
        },
      },
    },
  },
};

const navigation = {
  push: jest.fn(),
};

describe('the UpNextButtonConnected', () => {
  it('renders a loading state when loading', async () => {
    const tree = renderer.create(
      <Providers mocks={[noChildrenMock]}>
        <UpNextButtonConnected contentId={'1'} navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders nothing when on an empty series', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[noChildrenMock]}>
        <UpNextButtonConnected contentId={'1'} navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a finished state when finished', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[finishedMock]}>
        <UpNextButtonConnected contentId={'1'} navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a continue state when in progress', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[upNextMock]}>
        <UpNextButtonConnected contentId={'1'} navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a continue state even with no children', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[upNextNoChildrenMock]}>
        <UpNextButtonConnected contentId={'1'} navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a loading state state without a contentId', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[upNextMock]}>
        <UpNextButtonConnected navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('accepts doneText, continueText and Component as props, ', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[upNextMock]}>
        <UpNextButtonConnected
          finishedText={"You're done forever!"}
          continueText="Hold on cowboy, you got more to do"
          Component={View}
          contentId="1"
          navigation={navigation}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
