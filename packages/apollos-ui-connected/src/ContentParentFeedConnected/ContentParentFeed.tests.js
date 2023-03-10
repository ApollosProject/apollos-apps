import React from 'react';

import {
  Providers,
  renderWithApolloData,
  WithReactNavigator,
} from '@apollosproject/ui-test-utils';

import { MockedProvider } from '@apollo/client/testing';
import { GET_CONTENT_CARD } from '../ContentCardConnected';

import GET_CONTENT_PARENT_CHILDREN from './getContentParentChildren';
import ContentParentFeedConnected from './ContentParentFeedConnected';

const mock = {
  request: {
    query: GET_CONTENT_PARENT_CHILDREN,
    variables: { nodeId: 'ContentSeriesContentItem:123' },
  },
  result: {
    data: {
      node: {
        id: 'ContentSeriesContentItem:123',
        childContentItemsConnection: {
          edges: [
            {
              cursor: 'b487224762b030f470967f45d7205823',
              node: {
                id: 'DevotionalContentItem:d395278cd4b68e074ca4e595c8feab6d',
                videos: [],
                theme: null,
                summary: 'bla bla bla',
                coverImage: {
                  name: 'Square image',
                  __typename: 'ImageMedia',
                  sources: [
                    {
                      uri:
                        'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D31af1a61-360c-4b1e-8e62-45517c06a9a2',
                      __typename: 'ImageMediaSource',
                    },
                  ],
                },
                parentChannel: {
                  id: 'ContentChannel:559b23fd0aa90e81b1c023e72e230fa1',
                  name: 'Devotional',
                  iconName: 'text',
                  __typename: 'ContentChannel',
                },
                title: 'God sees who you can be not who you are',
                hyphenatedTitle: 'God sees who you can be not who you are',
                sharing: {
                  url:
                    'https://apollosrock.newspring.cc/devotional/god-sees-who-you-can-be-not-who-you-are',
                  message:
                    'God sees who you can be not who you are - Life is challenging enough.',
                  title: 'Share via ...',
                  __typename: 'SharableContentItem',
                },
                __typename: 'DevotionalContentItem',
              },
              __typename: 'ContentItemsConnectionEdge',
            },
            {
              cursor: '4affc1122ad80d4edcf6c5bc9d88ae99',
              node: {
                id: 'DevotionalContentItem:fbea6914a3e8877516cbd333d919075d',
                videos: [],
                theme: null,
                summary: 'bla bla bla',
                coverImage: {
                  name: 'Square image',
                  __typename: 'ImageMedia',
                  sources: [
                    {
                      uri:
                        'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D31af1a61-360c-4b1e-8e62-45517c06a9a2',
                      __typename: 'ImageMediaSource',
                    },
                  ],
                },
                parentChannel: {
                  id: 'ContentChannel:559b23fd0aa90e81b1c023e72e230fa1',
                  name: 'Devotional',
                  iconName: 'text',
                  __typename: 'ContentChannel',
                },
                title: 'Thank God for the friends who will tell it like it is',
                hyphenatedTitle:
                  'Thank God for the friends who will tell it like it is',
                sharing: {
                  url:
                    'https://apollosrock.newspring.cc/devotional/thank-god-for-the-friends-who-will-tell-it-like-it-is',
                  message:
                    'Thank God for the friends who will tell it like it is - Some of us grew up in a sanitized church.',
                  title: 'Share via ...',
                  __typename: 'SharableContentItem',
                },
                __typename: 'DevotionalContentItem',
              },
              __typename: 'ContentItemsConnectionEdge',
            },
            {
              cursor: '659a26257a49fb2bf1446bb747bf7dd3',
              node: {
                id: 'DevotionalContentItem:5e18250f586ab8de4d3d6292c919dcc4',
                videos: [],
                theme: null,
                summary: 'bla bla bla',
                coverImage: {
                  name: 'Square image',
                  __typename: 'ImageMedia',
                  sources: [
                    {
                      uri:
                        'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D31af1a61-360c-4b1e-8e62-45517c06a9a2',
                      __typename: 'ImageMediaSource',
                    },
                  ],
                },
                parentChannel: {
                  id: 'ContentChannel:559b23fd0aa90e81b1c023e72e230fa1',
                  name: 'Devotional',
                  iconName: 'text',
                  __typename: 'ContentChannel',
                },
                title: 'No sin is too bad',
                hyphenatedTitle: 'No sin is too bad',
                sharing: {
                  url:
                    'https://apollosrock.newspring.cc/devotional/no-sin-is-too-bad',
                  message:
                    'No sin is too bad - In Jeremiah 3, God???s people had really messed up.',
                  title: 'Share via ...',
                  __typename: 'SharableContentItem',
                },
                __typename: 'DevotionalContentItem',
              },
              __typename: 'ContentItemsConnectionEdge',
            },
            {
              cursor: 'c8d2fe738629909c33010432432f21c8',
              node: {
                id: 'DevotionalContentItem:bdc2c29b85949e4ca8232b373a07953d',
                videos: [],
                theme: null,
                summary: 'bla bla bla',
                coverImage: {
                  name: 'Square image',
                  __typename: 'ImageMedia',
                  sources: [
                    {
                      uri:
                        'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D31af1a61-360c-4b1e-8e62-45517c06a9a2',
                      __typename: 'ImageMediaSource',
                    },
                  ],
                },
                parentChannel: {
                  id: 'ContentChannel:559b23fd0aa90e81b1c023e72e230fa1',
                  name: 'Devotional',
                  iconName: 'text',
                  __typename: 'ContentChannel',
                },
                title: 'Change starts with a choice',
                hyphenatedTitle: 'Change starts with a choice',
                sharing: {
                  url:
                    'https://apollosrock.newspring.cc/devotional/change-starts-with-a-choice',
                  message:
                    'Change starts with a choice - Have you ever restored an old piece of furniture?',
                  title: 'Share via ...',
                  __typename: 'SharableContentItem',
                },
                __typename: 'DevotionalContentItem',
              },
              __typename: 'ContentItemsConnectionEdge',
            },
          ],
          __typename: 'ContentItemsConnection',
        },
        __typename: 'ContentSeriesContentItem',
      },
    },
  },
};

const navigation = {
  push: jest.fn(),
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

describe('the ContentParentFeedConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      WithReactNavigator(
        <Providers
          MockedProvider={MockedProvider}
          mocks={[mock, ...additionalMocks]}
        >
          <ContentParentFeedConnected
            nodeId={'ContentSeriesContentItem:123'}
            navigation={navigation}
          />
        </Providers>
      )
    );
    await new Promise((res) => setTimeout(res, 100));
    expect(tree).toMatchSnapshot();
  });
});
