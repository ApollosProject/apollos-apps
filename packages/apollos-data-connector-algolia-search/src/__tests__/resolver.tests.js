import { fetch } from 'apollo-server-env';
import gql from 'graphql-tag';
import { graphql } from 'graphql';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import ApollosConfig from '@apollosproject/config';
import { createCursor } from '@apollosproject/server-core';
// import { searchSchema } from '@apollosproject/data-schema';
import * as Search from '../index';

ApollosConfig.loadJs({
  ALGOLIA: {
    APPLICATION_ID: 'test',
    API_KEY: 'test',
    SEARCH_INDEX: 'test',
  },
});
// we import the root-level schema and resolver so we test the entire integration:

const { getSchema, getContext } = createTestHelpers({
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
describe('Algolia Search', () => {
  let schema;
  let context;
  beforeEach(() => {
    schema = getSchema();
    context = getContext();

    fetch.resetMocks();
  });

  it('returns', async () => {
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
});
