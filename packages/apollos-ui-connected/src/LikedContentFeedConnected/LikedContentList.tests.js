import React from 'react';

import { View } from 'react-native';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { GET_CONTENT_CARD } from '../ContentCardConnected';
import GET_LIKED_CONTENT from './getLikedContent';

import LikedContentFeedConnected from '.';

describe('LikedContentFeedConnected component', () => {
  it('renders LikedContentFeedConnected', async () => {
    const mock = {
      request: {
        query: GET_LIKED_CONTENT,
        variables: { first: 20 },
      },
      result: {
        data: {
          likedContent: {
            pageInfo: {
              __typename: 'PaginationInfo',
              endCursor: 'some-cursor',
            },
            __typename: 'ContentItemsConnection',
            edges: [
              {
                __typename: 'ContentItemsConnectionEdge',
                node: {
                  __typename: 'UniversalContentItem',
                  id: 'UniversalContentItem:4148aeb9482181025e9cad42826e676a',
                  hyphenatedTitle: 'Vacations and Your Budget',
                  title: 'Making Prayer a Spiritual Habit',
                  summary: 'Some summary',
                  coverImage: {
                    __typename: 'ImageMedia',
                    sources: [
                      {
                        __typename: 'ImageMediaSource',
                        uri:
                          'https://apollosrock.newspring.cc/GetImage.ashx?guid=55be1fd5-d8eb-43a6-aa70-f8e27bb63d31',
                      },
                    ],
                  },
                  isLiked: true,
                  sharing: {
                    title: 'Making Prayer a Spiritual Habit',
                    message: '',
                    url: 'https://apollosrock.newspring.cc/',
                  },
                  theme: null,
                },
              },
              {
                __typename: 'ContentItemsConnectionEdge',
                node: {
                  __typename: 'UniversalContentItem',
                  id: 'UniversalContentItem:9dbdc4e565dcaa3c9b17eb5ae42de96e',
                  hyphenatedTitle: 'Vacations and Your Budget',
                  title: 'Vacations and Your Budget',
                  summary: 'Some summary',
                  coverImage: {
                    __typename: 'ImageMedia',
                    sources: [
                      {
                        __typename: 'ImageMediaSource',
                        uri:
                          'https://apollosrock.newspring.cc/GetImage.ashx?guid=993efb47-47ec-4dec-a3d3-47bcacfbd58e',
                      },
                    ],
                  },
                  isLiked: true,
                  sharing: {
                    title: 'Vacations and Your Budget',
                    message: '',
                    url: 'https://apollosrock.newspring.cc/',
                  },
                  theme: null,
                },
              },
            ],
          },
        },
      },
    };

    const additionalMocks = mock.result.data.likedContent.edges.map(
      ({ node }) => ({
        request: {
          query: GET_CONTENT_CARD,
          variables: { contentId: node.id },
        },
        result: {
          data: {
            node: {
              ...node,
              coverImage: {
                name: 'Boom',
                ...node.coverImage,
              },
            },
          },
        },
      })
    );
    const navigation = { navigate: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers
        MockedProvider={MockedProvider}
        mocks={[mock, ...additionalMocks]}
      >
        <LikedContentFeedConnected
          ContentCardComponent={View}
          navigation={navigation}
        />
      </Providers>,
      null,
      { renderCount: 2 }
    );
    expect(tree).toMatchSnapshot();
  });
});
