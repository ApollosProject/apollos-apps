import React from 'react';

import { renderWithApolloData, Providers } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { GET_CONTENT_CARD } from '../ContentCardConnected';
import GET_CONTENT_FEED from './getContentFeed';

import ContentFeed from './ContentFeedConnected';

describe('content feed query component', () => {
  it('renders a feedview after successful query', async () => {
    const mock = {
      request: {
        query: GET_CONTENT_FEED,
        variables: { itemId: 'ContentChannel:123' },
      },
      result: {
        data: {
          node: {
            __typename: 'ContentChannel',
            childContentItemsConnection: {
              pageInfo: {
                endCursor: 'blablalba',
                __typename: 'PaginationInfo',
              },
              __typename: 'ContentItemsConnection',
              edges: [
                {
                  __typename: 'ContentItemsConnectionEdge',
                  node: {
                    __typename: 'UniversalContentItem',
                    id: 'UniversalContentItem:d57994350b9d213866b24dea3a97433d',
                    coverImage: null,
                    parentChannel: {
                      id: 'ContentChannel:4f68015ba18662a7409d1219a4ce013e',
                      name: 'Editorial',
                      iconName: 'text',
                      __typename: 'ContentChannel',
                    },
                    title: 'Mea Animal Aperiam Ornatus Eu',
                    hyphenatedTitle: 'Mea Animal Aperiam Ornatus Eu',
                    summary: 'Bla bla bla',
                    theme: null,
                    isLiked: false,
                    likedCount: 0,
                    videos: [],
                    audios: [],
                  },
                },
                {
                  __typename: 'ContentItemsConnectionEdge',
                  node: {
                    __typename: 'UniversalContentItem',
                    id: 'UniversalContentItem:b36e55d803443431e96bb4b5068147ec',
                    coverImage: null,
                    parentChannel: {
                      id: 'ContentChannel:4f68015ba18662a7409d1219a4ce013e',
                      name: 'Editorial',
                      iconName: 'text',
                      __typename: 'ContentChannel',
                    },
                    title: 'Probo Senserit Id Mea, Ut Sed Malis Postea,',
                    hyphenatedTitle:
                      'Probo Senserit Id Mea, Ut Sed Malis Postea,',
                    summary: 'Bla bla bla',
                    theme: null,
                    isLiked: false,
                    likedCount: 0,
                    videos: [],
                    audios: [],
                  },
                },
              ],
            },
          },
        },
      },
    };

    const additionalMocks = mock.result.data.node.childContentItemsConnection.edges.map(
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

    const initialTree = await renderWithApolloData(
      <Providers
        MockedProvider={MockedProvider}
        mocks={[mock, ...additionalMocks]}
      >
        <ContentFeed route={{ params: { itemId: 'ContentChannel:123' } }} />
      </Providers>
    );
    const tree = await renderWithApolloData(
      <Providers
        MockedProvider={MockedProvider}
        mocks={[mock, ...additionalMocks]}
      >
        <ContentFeed route={{ params: { itemId: 'ContentChannel:123' } }} />
      </Providers>,
      initialTree
    );
    expect(tree).toMatchSnapshot();
  });
});
