import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import { makeExecutableSchema } from 'apollo-server';
import { KeyValueCache } from 'apollo-server-caching';
import { createApolloServerConfig } from '@apollosproject/server-core';
import { testSchema } from '@apollosproject/data-schema';
import * as Scripture from '../index';

const serverConfig = createApolloServerConfig({ Scripture });

function getTestContext(req) {
  const testContext = serverConfig.context(req);
  const testDataSources = serverConfig.dataSources();
  // Apollo Server does this internally.
  Object.values(testDataSources).forEach((dataSource) => {
    if (dataSource.initialize) {
      dataSource.initialize({ context: testContext, cache: KeyValueCache });
    }
  });
  testContext.dataSources = testDataSources;
  return testContext;
}

describe('Scripture', () => {
  let schema;
  let context;
  beforeEach(() => {
    schema = makeExecutableSchema({
      typeDefs: [...serverConfig.schema, testSchema],
      resolvers: serverConfig.resolvers,
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    });
    context = getTestContext();

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
