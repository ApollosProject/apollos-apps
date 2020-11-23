import React from 'react';
import renderer from 'react-test-renderer';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_HERO_LIST_FEATURE from './getHeroListFeature';

import HeroListFeatureConnected from './HeroListFeatureConnected';

const mock = {
  request: {
    query: GET_HERO_LIST_FEATURE,
    variables: { featureId: 'HeroListFeature:123' },
  },
  result: {
    data: {
      node: {
        id: 'HeroListFeature:123',
        __typename: 'HeroListFeature',
        title: 'Some cool list',
        subtitle: 'Check it out',
        heroCard: {
          __typename: 'CardListCard',
          id: 'CardListCard:123',
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
        primaryAction: {
          __typename: 'ActionFeatureAction',
          action: 'OPEN_URL',
          title: 'Check this out',
          relatedNode: {
            __typename: 'Url',
            id: 'Url:123',
            url: 'https://www.google.com',
          },
        },
        actions: [
          {
            __typename: 'ActionListFeatureAction',
            id: 'ActionListFeatureAction',
            title: 'Boom',
            subtitle: 'What',
            action: 'READ_CONTENT',
            image: {
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

const noHeroCardMock = {
  ...mock,
  result: {
    data: {
      node: {
        ...mock.result.data.node,
        heroCard: null,
      },
    },
  },
};

const noActionsMock = {
  ...mock,
  result: {
    data: {
      node: {
        ...mock.result.data.node,
        actions: [],
      },
    },
  },
};

const noActionsOrHeroMock = {
  ...mock,
  result: {
    data: {
      node: {
        ...mock.result.data.node,
        heroCard: null,
        actions: [],
      },
    },
  },
};

describe('The HeroListFeatureConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <HeroListFeatureConnected
          refetchRef={jest.fn()}
          featureId={'HeroListFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render without a hero card', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[noHeroCardMock]}>
        <HeroListFeatureConnected
          refetchRef={jest.fn()}
          featureId={'HeroListFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render without actions', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[noActionsMock]}>
        <HeroListFeatureConnected
          refetchRef={jest.fn()}
          featureId={'HeroListFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should not render without actions or hero', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[noActionsOrHeroMock]}>
        <HeroListFeatureConnected
          refetchRef={jest.fn()}
          featureId={'HeroListFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state when isLoading', async () => {
    const tree = renderer.create(
      <Providers MockedProvider={MockedProvider}>
        <HeroListFeatureConnected
          refetchRef={jest.fn()}
          featureId={'HeroListFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
