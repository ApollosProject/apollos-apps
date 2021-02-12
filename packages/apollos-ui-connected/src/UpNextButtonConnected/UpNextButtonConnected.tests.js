import React from 'react';
import renderer from 'react-test-renderer';
import { View } from 'react-native';
import {
  Providers,
  renderWithApolloData,
  WithReactNavigator,
} from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

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
          __typename: 'ContentItemsConnection',
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
      WithReactNavigator(
        <Providers MockedProvider={MockedProvider} mocks={[noChildrenMock]}>
          <UpNextButtonConnected contentId={'1'} navigation={navigation} />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders nothing when on an empty series', async () => {
    const tree = await renderWithApolloData(
      WithReactNavigator(
        <Providers MockedProvider={MockedProvider} mocks={[noChildrenMock]}>
          <UpNextButtonConnected contentId={'1'} navigation={navigation} />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a finished state when finished', async () => {
    const tree = await renderWithApolloData(
      WithReactNavigator(
        <Providers MockedProvider={MockedProvider} mocks={[finishedMock]}>
          <UpNextButtonConnected contentId={'1'} navigation={navigation} />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a continue state when in progress', async () => {
    const tree = await renderWithApolloData(
      WithReactNavigator(
        <Providers MockedProvider={MockedProvider} mocks={[upNextMock]}>
          <UpNextButtonConnected contentId={'1'} navigation={navigation} />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a continue state even with no children', async () => {
    const tree = await renderWithApolloData(
      WithReactNavigator(
        <Providers
          MockedProvider={MockedProvider}
          mocks={[upNextNoChildrenMock]}
        >
          <UpNextButtonConnected contentId={'1'} navigation={navigation} />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
  it("doesn't render a loading state state without a contentId", async () => {
    const tree = renderer.create(
      WithReactNavigator(
        <Providers MockedProvider={MockedProvider} mocks={[upNextMock]}>
          <UpNextButtonConnected navigation={navigation} />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a loading state state with a content series', async () => {
    const tree = await renderer.create(
      WithReactNavigator(
        <Providers MockedProvider={MockedProvider} mocks={[upNextMock]}>
          <UpNextButtonConnected
            nodeId="ContentSeriesContentItem:1"
            navigation={navigation}
          />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
  it("doesn't render loading state state with a devotational", async () => {
    const tree = renderer.create(
      WithReactNavigator(
        <Providers MockedProvider={MockedProvider} mocks={[upNextMock]}>
          <UpNextButtonConnected
            nodeId="DevotionalContentItem:1"
            navigation={navigation}
          />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
  it('accepts doneText, continueText and Component as props, ', async () => {
    const tree = await renderWithApolloData(
      WithReactNavigator(
        <Providers MockedProvider={MockedProvider} mocks={[upNextMock]}>
          <UpNextButtonConnected
            finishedText={"You're done forever!"}
            continueText="Hold on cowboy, you got more to do"
            Component={View}
            contentId="1"
            navigation={navigation}
          />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
});
