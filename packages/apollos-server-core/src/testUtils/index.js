/* eslint-disable import/prefer-default-export */
import { makeExecutableSchema } from 'apollo-server';
import { testSchema } from '@apollosproject/data-schema';
import { KeyValueCache } from 'apollo-server-caching';
import { createApolloServerConfig } from '..';

export const createTestHelpers = (models) => {
  const serverConfig = createApolloServerConfig(models);
  const getContext = (req) => {
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
  };
  const getSchema = (schemas = []) =>
    makeExecutableSchema({
      typeDefs: [...serverConfig.schema, ...schemas, testSchema],
      resolvers: serverConfig.resolvers,
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    });

  return { getSchema, getContext };
};
