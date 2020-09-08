import React from 'react';
import renderer from 'react-test-renderer';

import { Providers, renderWithApolloData } from '../testUtils';

import GET_HORIZONTAL_CARD_LIST_FEATURE from './getHorizontalCardListFeature';
import HorizontalCardListFeatureConnected from './index';

const mock = {
  request: {
    query: GET_HORIZONTAL_CARD_LIST_FEATURE,
    variables: { featureId: 'HorizontalCardListFeature:123' },
  },
  result: {
    data: {
      node: {
        id: 'HorizontalCardListFeature:123',
        __typename: 'ActionListFeature',
        title: 'Some cool list',
        subtitle: 'Check it out',
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

describe('The HorizontalCardListFeatureConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <HorizontalCardListFeatureConnected
          featureId={'HorizontalCardListFeature:123'}
          refetchRef={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should not render without cards', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[noCardsMock]}>
        <HorizontalCardListFeatureConnected
          featureId={'HorizontalCardListFeature:123'}
          refetchRef={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state when isLoading', async () => {
    const tree = renderer.create(
      <Providers>
        <HorizontalCardListFeatureConnected
          featureId={'HorizontalCardListFeature:123'}
          refetchRef={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
