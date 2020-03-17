import React from 'react';
import { GET_LIKED_CONTENT } from '@apollosproject/ui-connected';

import { Providers, renderWithApolloData } from '../utils/testUtils';

import HorizontalContentCardConnected from '../HorizontalContentCardConnected';
import HorizontalLikedContentFeedConnected from './HorizontalLikedContentFeedConnected';

describe('HorizontalLikedContentFeedConnected', () => {
  const twoItemsMock = {
    request: {
      query: GET_LIKED_CONTENT,
      variables: { first: 3 },
    },
    result: {
      data: {
        likedContent: {
          __typename: 'ContentItemsConnection',
          pageInfo: {
            __typename: 'PaginationInfo',
            endCursor: '123',
          },
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
                hyphenatedTitle: 'Probo Senserit Id Mea, Ut Sed Malis Postea,',
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
  };
  it('renders a HorizontalLikedContentFeedConnected', async () => {
    const navigation = { navigate: jest.fn(), getParam: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers mocks={[twoItemsMock]}>
        <HorizontalLikedContentFeedConnected navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders a HorizontalLikedContentFeedConnected with a custom component', async () => {
    const navigation = { navigate: jest.fn(), getParam: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers mocks={[twoItemsMock]}>
        <HorizontalLikedContentFeedConnected
          Component={() => <HorizontalContentCardConnected labelText="hello" />}
          navigation={navigation}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders nothing if no liked content', async () => {
    const mock = {
      request: {
        query: GET_LIKED_CONTENT,
      },
      result: {
        data: {
          likedContent: {
            __typename: 'ContentItemsConnection',
            pageInfo: {
              __typename: 'PaginationInfo',
              endCursor: null,
            },
            edges: [],
          },
        },
      },
    };
    const navigation = { navigate: jest.fn(), getParam: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <HorizontalLikedContentFeedConnected navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
