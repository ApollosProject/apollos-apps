import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import { makeExecutableSchema } from 'apollo-server';
import {
  createGlobalId,
  createApolloServerConfig,
} from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

import {
  mediaSchema,
  testSchema,
  themeSchema,
  scriptureSchema,
} from '@apollosproject/data-schema';

import { buildContext } from '../../test-utils';
// we import the root-level schema and resolver so we test the entire integration:
import { ContentChannel, ContentItem, Sharable } from '../..';

const serverConfig = createApolloServerConfig({
  ContentChannel,
  ContentItem,
  Sharable,
});
const getTestContext = buildContext(serverConfig);

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
  ROCK_MAPPINGS: {
    DISCOVER_CONTENT_CHANNEL_IDS: [2, 3, 4, 6, 8],
  },
});

const contentChannelFragment = `
  fragment ContentChannelFragment on ContentChannel {
    id
    __typename
    name
    description
    childContentChannels {
      id
      __typename
      name
      description
    }
    iconName
    childContentItemsConnection {
      edges {
        cursor
        node {
          id
          __typename
        }
      }
    }
  }
`;

describe('ContentChannel', () => {
  let schema;
  let context;
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockRockDataSourceAPI();
    schema = makeExecutableSchema({
      typeDefs: [
        ...serverConfig.schema,
        mediaSchema,
        testSchema,
        themeSchema,
        scriptureSchema,
      ],
      resolvers: serverConfig.resolvers,
    });
    context = getTestContext();
  });

  it('gets a list of content channels', async () => {
    const query = `
      query {
        contentChannels {
          ...ContentChannelFragment
        }
      }
      ${contentChannelFragment}
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets a single content channel when querying by root node', async () => {
    const query = `
      query {
        node(
          id: "${createGlobalId(1, 'ContentChannel')}"
        ) {
          ...on ContentChannel {
            ...ContentChannelFragment
          }
        }
      }
      ${contentChannelFragment}
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
