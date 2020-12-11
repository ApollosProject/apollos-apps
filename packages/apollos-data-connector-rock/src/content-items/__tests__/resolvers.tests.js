import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';

import { createGlobalId } from '@apollosproject/server-core';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import ApollosConfig from '@apollosproject/config';
import { AuthenticationError } from 'apollo-server';
import { get } from 'lodash';

import {
  mediaSchema,
  themeSchema,
  scriptureSchema,
  liveSchema,
  featuresSchema,
} from '@apollosproject/data-schema';

import * as RockConstants from '../../rock-constants';
// we import the root-level schema and resolver so we test the entire integration:
import { ContentChannel, ContentItem, Sharable, Person } from '../..';

import { generateToken } from '../../auth/token';

class Scripture {
  // eslint-disable-next-line class-methods-use-this
  initialize() {}

  // eslint-disable-next-line class-methods-use-this
  getScriptures() {
    return [
      {
        html: `<p class="p"><span data-number="1" class="v">1</span>The Song of songs, which is Solomon’s.</p>`,
      },
    ];
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

class Cache {
  get = () => Promise.resolve(null);

  set = () => Promise.resolve(null);

  initialize({ context }) {
    this.context = context;
  }
}

const { getSchema, getContext } = createTestHelpers({
  ContentChannel,
  ContentItem,
  Sharable,
  UniversalContentItem: {
    dataSource: ContentItem.dataSource,
  }, // alias
  DevotionalContentItem: {
    dataSource: ContentItem.dataSource,
  }, // alias
  Scripture: {
    dataSource: Scripture,
  },
  RockConstants,
  Person,
  Auth,
  Cache: { dataSource: Cache },
});
// we import the root-level schema and resolver so we test the entire integration:

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
    TIMEZONE: 'America/New_York',
  },
  ROCK_CONSTANTS: {
    IMAGE: 10,
    AUDIO_FILE: 77,
    VIDEO_FILE: 79,
  },
  ROCK_MAPPINGS: {
    FEED_CONTENT_CHANNEL_IDS: [1, 2, 3, 4, 6, 8],
    SERIES_CONTENT_CHANNEL_TYPE_IDS: [6, 7],
  },
});

const contentItemFragment = `
  fragment ContentItemFragment on ContentItem {
    id
    __typename
    title
    publishDate
    summary
    coverImage {
      name
      key
      sources {
        uri
      }
    }
    images {
      __typename # Typenames here to increase test coverage
      name
      key
      sources {
        __typename
        uri
      }
    }
    videos {
      __typename
      name
      key
      sources {
        __typename
        uri
      }
      embedHtml
    }
    audios {
      __typename
      name
      key
      sources {
        __typename
        uri
      }
    }
    htmlContent
    childContentItemsConnection {
      edges {
        node {
          id
          __typename
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
      }
    }
    parentChannel {
      id
      __typename
    }
    sharing {
      __typename
      url
      title
      message
    }
  }
`;

describe('UniversalContentItem', () => {
  let schema;
  let context;
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockRockDataSourceAPI();
    schema = getSchema([
      featuresSchema,
      themeSchema,
      mediaSchema,
      scriptureSchema,
      liveSchema,
    ]);

    const token = generateToken({ cookie: 'some-cookie', sessionId: 123 });
    context = getContext({
      req: {
        headers: { authorization: token },
      },
    });
    context.dataSources.ContentItem.getShareUrl = jest.fn(() => 'fakeurl.com');
  });

  it('gets a user feed', async () => {
    const query = `
      query {
        userFeed {
          edges {
            node {
              ...ContentItemFragment
            }
          }
        }
      }
      ${contentItemFragment}
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets a persona feed', async () => {
    const query = `
      query {
        personaFeed {
          edges {
            node {
              ...ContentItemFragment
            }
          }
        }
      }
      ${contentItemFragment}
    `;

    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets campaigns content', async () => {
    const query = `
      query {
        campaigns {
          edges {
            node {
              ...ContentItemFragment
            }
          }
        }
      }
      ${contentItemFragment}
    `;

    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets a content item', async () => {
    const query = `
      query {
        node(id: "${createGlobalId(1, 'UniversalContentItem')}") {
          ...ContentItemFragment
        }
      }
      ${contentItemFragment}
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets a MediaContentItem item', async () => {
    const query = `
      query {
        node(id: "${createGlobalId(1, 'MediaContentItem')}") {
          ...ContentItemFragment
        }
      }
      ${contentItemFragment}
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets a ContentSeriesContentItem item', async () => {
    const query = `
      query {
        node(id: "${createGlobalId(1, 'ContentSeriesContentItem')}") {
          ...ContentItemFragment
        }
      }
      ${contentItemFragment}
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets a devotional item', async () => {
    const query = `
      query {
        node(id: "${createGlobalId(123, 'DevotionalContentItem')}") {
          id
          ... on DevotionalContentItem {
            id
            title
            scriptures {
              html
            }
          }
        }
      }
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets a WeekendContentItem item', async () => {
    const query = `
      query {
        node(id: "${createGlobalId(1, 'WeekendContentItem')}") {
          ...ContentItemFragment
        }
      }
      ${contentItemFragment}
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets a devotional item', async () => {
    const query = `
      query {
        node(id: "${createGlobalId(123, 'DevotionalContentItem')}") {
          id
          ... on DevotionalContentItem {
            id
            title
            scriptures {
              html
            }
          }
        }
      }
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it("gets a content item and it's siblings", async () => {
    const query = `
      query {
        userFeed {
          edges {
            node {
              ...ContentItemFragment
              ... on UniversalContentItem {
                siblingContentItemsConnection {
                        edges {
                    node {
                      id
                      __typename
                    }
                    cursor
                  }
                }
              }
            }
          }
        }
      }
      ${contentItemFragment}
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('properly handles empty attribute values', async () => {
    const query = `
      query {
        node(id: "${createGlobalId(
          'test-case-no-attributes',
          'UniversalContentItem'
        )}") {
          ...ContentItemFragment
        }
      }
      ${contentItemFragment}
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});

const {
  ContentItemsConnection,
  ContentItem: ContentItemResolver,
} = ContentItem.resolver;

describe('ContentItem resolver', () => {
  let context;
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockRockDataSourceAPI();
    context = getContext();
  });
  it('fetches an item summary for an item with no description', () => {
    const item = { content: '' };
    const summary = ContentItemResolver.summary(item, {}, context);
    expect(summary).toEqual('');
  });
  // We noticed that Rock sends back an empty object for this property
  it('fetches an item summary for an item with an empty object for condition', () => {
    const item = { content: {} };
    const summary = ContentItemResolver.summary(item, {}, context);
    expect(summary).toEqual('');
  });
  it('fetches an item summary for an item with a description', () => {
    const item = { content: 'Foo bar baz. Some other foo.' };
    const summary = ContentItemResolver.summary(item, {}, context);
    expect(summary).toEqual('Foo bar baz.');
  });
});

describe('ContentItemsConnection resolver', () => {
  it('builds a pageInfo object with items', async () => {
    const edges = Promise.resolve([
      { cursor: `item-0` },
      { cursor: `item-1` },
      { cursor: `item-2` },
    ]);
    const { startCursor, endCursor } = await ContentItemsConnection.pageInfo({
      edges,
    });

    expect(startCursor).toEqual('item-0');
    expect(endCursor).toEqual('item-2');
  });
  it('builds a pageInfo object without items', async () => {
    const edges = [];
    const { startCursor, endCursor } = await ContentItemsConnection.pageInfo({
      edges,
    });

    expect(startCursor).toEqual(null);
    expect(endCursor).toEqual(null);
  });
});
