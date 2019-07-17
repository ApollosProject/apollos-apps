import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import { createGlobalId } from '@apollosproject/server-core';
import * as Scripture from '../index';

const { getContext, getSchema } = createTestHelpers({ Scripture });

describe('Scripture', () => {
  let schema;
  let context;
  beforeEach(() => {
    schema = getSchema();
    context = getContext();

    fetch.resetMocks();
    fetch.mockLiveDataSourceApis();
  });

  it('returns a single verse', async () => {
    const query = `
      query {
        scripture (query: "SNG.1.1") {
          id
          html
          reference
          copyright
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('returns multiple verses', async () => {
    const query = `
      query {
        scriptures (query: "1 Peter 1:1 and John 3:16") {
          id
          html
          reference
          copyright
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('returns a verse as by node', async () => {
    const query = `
      query {
        node (id: "${createGlobalId('SNG.1.1', 'Scripture')}") {
          id
          ... on Scripture {
            html
            reference
            copyright
          }
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
