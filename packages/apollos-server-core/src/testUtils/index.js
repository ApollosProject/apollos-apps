/* eslint-disable import/prefer-default-export */
import { makeExecutableSchema } from 'apollo-server';
import { testSchema } from '@apollosproject/data-schema';
import { createApolloServerConfig, createContextGetter } from '..';

export const createTestHelpers = (models) => {
  const serverConfig = createApolloServerConfig(models);

  const getContext = createContextGetter(serverConfig);

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
