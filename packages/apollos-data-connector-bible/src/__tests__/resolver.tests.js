import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
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

  it('returns', async () => {
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
});
