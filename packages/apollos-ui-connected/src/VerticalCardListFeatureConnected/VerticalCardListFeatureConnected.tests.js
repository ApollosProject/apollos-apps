import React from 'react';
import renderer from 'react-test-renderer';

import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_VERTICAL_CARD_LIST_FEATURE from './getVerticalCardListFeature';
import VerticalCardListFeatureConnected from './index';

const mock = {
  request: {
    query: GET_VERTICAL_CARD_LIST_FEATURE,
    variables: { featureId: 'VerticalCardListFeature:123' },
  },
  result: {
    data: {
      node: {
        id: 'VerticalCardListFeature:123',
        __typename: 'VerticalCardListFeature',
        title: '',
        subtitle: 'Check it out',
        isFeatured: false,
        cards: [
          {
            __typename: 'CardListItem',
            id: 'CardListItem:123',
            title: 'Boom',
            hyphenatedTitle: 'Boom',
            hasAction: false,
            actionIcon: null,
            labelText: 'What',
            action: 'READ_CONTENT',
            summary: 'Read',
            coverImage: {
              __typename: 'ImageMedia',
              sources: [
                {
                  __typename: 'ImageMediaSource',
                  uri: 'https://picsum.photos/200/200',
                },
              ],
            },
            relatedNode: {
              __typename: 'UniversalContentItem',
              id: 'UniversalContentItem:123',
            },
          },
        ],
      },
    },
  },
};

const noCardsMock = {
  ...mock,
  result: {
    data: {
      node: {
        ...mock.result.data.node,
        cards: [],
      },
    },
  },
};

describe('The VerticalCardListFeatureConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <VerticalCardListFeatureConnected
          featureId={'VerticalCardListFeature:123'}
          refetchRef={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should not render without cards', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[noCardsMock]}>
        <VerticalCardListFeatureConnected
          featureId={'VerticalCardListFeature:123'}
          refetchRef={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as a featured card', async () => {
    mock.result.data.node.isFeatured = true;
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <VerticalCardListFeatureConnected
          featureId={'VerticalCardListFeature:123'}
          refetchRef={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
    mock.result.data.node.isFeatured = false;
  });
  it('should not render as a featured card without cards', async () => {
    noCardsMock.result.data.node.isFeatured = true;
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[noCardsMock]}>
        <VerticalCardListFeatureConnected
          featureId={'VerticalCardListFeature:123'}
          refetchRef={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
    noCardsMock.result.data.node.isFeatured = false;
  });
  it('should render a loading state when isLoading', async () => {
    const tree = renderer.create(
      <Providers MockedProvider={MockedProvider}>
        <VerticalCardListFeatureConnected
          featureId={'VerticalCardListFeature:123'}
          refetchRef={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a featured loading state when isLoading', async () => {
    const tree = renderer.create(
      <Providers MockedProvider={MockedProvider}>
        <VerticalCardListFeatureConnected
          featureId={'VerticalCardListFeature:123'}
          refetchRef={jest.fn()}
          isFeatured
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
