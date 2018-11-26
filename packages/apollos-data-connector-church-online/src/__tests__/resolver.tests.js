import { fetch } from 'apollo-server-env';

import { graphql } from 'graphql';
import { makeExecutableSchema } from 'apollo-server';
import { KeyValueCache } from 'apollo-server-caching';
import { createApolloServerConfig } from '@apollosproject/server-core';
import { testSchema } from '@apollosproject/data-schema';
import * as LiveStream from '../index';
// we import the root-level schema and resolver so we test the entire integration:

const serverConfig = createApolloServerConfig({ LiveStream });
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

describe('LiveStream', () => {
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
        liveStream {
          isLive
          eventStartTime
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
