import { fetch } from 'apollo-server-env';
import { gql } from 'apollo-server';
import { graphql } from 'graphql';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import ApollosConfig, {
  dataSource as ConfigDataSource,
} from '@apollosproject/config';
import { createCursor } from '@apollosproject/server-core';
// import { searchSchema } from '@apollosproject/data-schema';
import * as Search from '../index';

ApollosConfig.default.loadJs({
  ALGOLIA: {
    APPLICATION_ID: 'test',
    API_KEY: 'test',
    SEARCH_INDEX: 'test',
  },
});
// we import the root-level schema and resolver so we test the entire integration:

const { getSchema, getContext } = createTestHelpers({
  Config: { dataSource: ConfigDataSource },
  Search,
  ContentItem: {
    schema: gql`
      type ContentItem implements Node {
        id: ID!
      }
    `,
    resolver: {
      ContentItem: {
        id: () => 'test',
      },
    },
    dataSource: class ContentItem {
      getFromId = () => ({});
    },
  },
});

let context;

describe('Algolia Search', () => {
  let schema;
  beforeEach(() => {
    schema = getSchema();
    fetch.resetMocks();
  });

  it('returns', async () => {
    context = await getContext(
      { req: { headers: { 'x-church': 'apollos_demo' } } },
      { church: { slug: 'apollos_demo' } }
    );
    const query = `
      query {
        search(query: "test") {
          edges {
            cursor
            title
            summary
            coverImage { sources { uri } }
            node {
              id
            }
          }
          pageInfo {
            startCursor
            endCursor
          }
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('paginates', async () => {
    context = await getContext(
      { req: { headers: { 'x-church': 'apollos_demo' } } },
      { church: { slug: 'apollos_demo' } }
    );
    const query = `
      query {
        search(query: "test", after: "${createCursor({ position: 1 })}") {
          edges {
            cursor
            title
            summary
            coverImage { sources { uri } }
            node {
              id
            }
          }
          pageInfo {
            startCursor
            endCursor
          }
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('throws error on invalid cursor', async () => {
    context = await getContext(
      { req: { headers: { 'x-church': 'apollos_demo' } } },
      { church: { slug: 'apollos_demo' } }
    );
    const query = `
      query {
        search(query: "test", after: "${createCursor({ '🐛': 1 })}") {
          edges {
            cursor
            title
            summary
            coverImage { sources { uri } }
            node {
              id
            }
          }
          pageInfo {
            startCursor
            endCursor
          }
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('safely captures invalid node', async () => {
    context = await getContext(
      { req: { headers: { 'x-church': 'apollos_demo' } } },
      { church: { slug: 'apollos_demo' } }
    );
    const query = `
      query {
        search(query: "test", after: "${createCursor({ position: 1 })}") {
          edges {
            cursor
            title
            summary
            coverImage { sources { uri } }
            node {
              id
            }
          }
          pageInfo {
            startCursor
            endCursor
          }
        }
      }
    `;
    const rootValue = {};

    context.models.Node.get = jest.fn(() => {
      throw new Error("Item doesn't exist");
    });

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
