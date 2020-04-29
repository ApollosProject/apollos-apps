import React from 'react';
import renderer from 'react-test-renderer';

import { Providers, renderWithApolloData } from '../utils/testUtils';

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
        __typename: 'ActionListFeature',
        title: '',
        subtitle: 'Check it out',
        isFeatured: false,
        cards: [
          {
            __typename: 'ActionListCard',
            id: 'ActionListCard:123',
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

describe('The VerticalCardListFeatureConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
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
      <Providers mocks={[mock]}>
        <VerticalCardListFeatureConnected
          featureId={'VerticalCardListFeature:123'}
          refetchRef={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
    mock.result.data.node.isFeatured = false;
  });
  it('should render a loading state when isLoading', async () => {
    const tree = renderer.create(
      <Providers>
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
      <Providers>
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
