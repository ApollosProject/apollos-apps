import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import ApollosConfig from '@apollosproject/config';
import { createGlobalId } from '@apollosproject/server-core';
import { AuthenticationError } from 'apollo-server';
import { get } from 'lodash';

import {
  contentItemSchema,
  contentChannelSchema,
  themeSchema,
  scriptureSchema,
} from '@apollosproject/data-schema';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import { generateToken } from '../../auth';
import * as Followings from '../index';
import * as RockConstants from '../../rock-constants';

class ContentItemDataSource {
  // eslint-disable-next-line class-methods-use-this
  initialize() {}

  // eslint-disable-next-line class-methods-use-this
  getFromId(id) {
    return { id };
  }

  // eslint-disable-next-line class-methods-use-this
  getFromIds(ids) {
    return { get: () => ids.map((id) => ({ id })) };
  }
}

class AuthDataSource {
  initialize({ context }) {
    this.context = context;
  }

  getCurrentPerson() {
    if (this.context.currentPerson) {
      return { id: 'someId' };
    }
    throw new AuthenticationError('Must be logged in');
  }
}

const ContentItem = {
  dataSource: ContentItemDataSource,
  resolver: {
    ContentItem: {
      __resolveType: () => 'UniversalContentItem',
    },
    UniversalContentItem: {
      id: ({ id }) => createGlobalId(id, 'UniversalContentItem'),
    },
  },
};

class Cache {
  initialize({ context }) {
    this.context = context;
  }

  get = jest.fn(() => Promise.resolve(null));

  set = jest.fn(() => Promise.resolve(null));

  increment = jest.fn(() => Promise.resolve(null));

  decrement = jest.fn(() => Promise.resolve(null));
}

const Auth = {
  dataSource: AuthDataSource,
  contextMiddleware: ({ req, context }) => {
    if (get(req, 'headers.authorization')) {
      return {
        ...context,
        currentPerson: true,
      };
    }
    return { ...context };
  },
};

const { getSchema, getContext } = createTestHelpers({
  Followings,
  RockConstants,
  ContentItem,
  UniversalContentItem: ContentItem,
  Auth,
  Cache: { dataSource: Cache },
});

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
  ROCK_MAPPINGS: {
    SERIES_CONTENT_CHANNEL_TYPE_IDS: [6, 7],
    CONTENT_ITEM_TYPES: [
      'ContentItem',
      'UniversalContentItem',
      'DevotionalContentItem',
      'MediaContentItem',
    ],
  },
});

describe('Following', () => {
  let schema;
  let context;
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockRockDataSourceAPI();
    schema = getSchema([
      contentItemSchema,
      contentChannelSchema,
      themeSchema,
      scriptureSchema,
    ]);
    const token = generateToken({ cookie: 'some-cookie', sessionId: 123 });
    context = getContext({
      req: {
        headers: { authorization: token },
      },
    });
  });

  it('likes an entity', async () => {
    const query = `
      mutation likeEntity {
        updateLikeEntity(
          input: {
            nodeId: "${createGlobalId(1, 'UniversalContentItem')}"
            operation: Like
          }
        ) {
          id
          isLiked
        }
      }
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
  it('likes a node', async () => {
    const query = `
      mutation likeEntity {
        updateLikeEntity(
          input: {
            nodeId: "${createGlobalId(1, 'UniversalContentItem')}"
            operation: Like
          }
        ) {
          id
          ... on LikableNode {
            isLiked
          }
        }
      }
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
  it('unlikes an entity', async () => {
    const query = `
      mutation likeEntity {
        updateLikeEntity(
          input: {
            nodeId: "${createGlobalId(1, 'UniversalContentItem')}"
            operation: Unlike
          }
        ) {
          id
          isLiked
        }
      }
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
  it('uses following table to track if a user liked content', async () => {
    const query = `
      query getContent {
        node(id: "${createGlobalId(1, 'UniversalContentItem')}") {
          id
          ... on ContentItem {
            isLiked
          }
        }
      }
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(context.dataSources.Cache.set.mock.calls).toMatchSnapshot();
  });

  it('uses following cache to track if a user liked content, if present', async () => {
    const query = `
      query getContent {
        node(id: "${createGlobalId(1, 'UniversalContentItem')}") {
          id
          ... on ContentItem {
            isLiked
          }
        }
      }
    `;
    context.dataSources.Cache.get = jest.fn(() => Promise.resolve(false));
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(context.dataSources.Cache.get.mock.calls).toMatchSnapshot();

    // Reset mock.
    context.dataSources.Cache.get = jest.fn(() => Promise.resolve());
  });

  it('returns isLiked false if a user is logged out', async () => {
    const query = `
      query getContent {
        node(id: "${createGlobalId(1, 'UniversalContentItem')}") {
          id
          ... on ContentItem {
            isLiked
          }
        }
      }
    `;
    const contextWithoutUser = getContext();
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, contextWithoutUser);
    expect(result).toMatchSnapshot();
  });

  it('returns a likeCount', async () => {
    const query = `
      query getContent {
        node(id: "${createGlobalId(1, 'UniversalContentItem')}") {
          id
          ... on ContentItem {
            likedCount
          }
        }
      }
    `;
    const contextWithoutUser = getContext();
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, contextWithoutUser);
    expect(result).toMatchSnapshot();
  });

  it('gets all user liked content', async () => {
    const query = `
      query {
        likedContent {
          edges {
            node {
              id
              isLiked
            }
          }
        }
      }
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('returns an empty array for liked content without a user logged in', async () => {
    const query = `
      query {
        likedContent {
          edges {
            node {
              id
              isLiked
            }
          }
        }
      }
    `;
    const contextWithoutUser = getContext();
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, contextWithoutUser);
    expect(result).toMatchSnapshot();
  });
});
