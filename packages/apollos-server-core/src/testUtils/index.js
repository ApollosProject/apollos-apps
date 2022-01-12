/* eslint-disable import/prefer-default-export */
import { makeExecutableSchema } from 'apollo-server';
import { testSchema } from '@apollosproject/data-schema';
import * as Node from '../node';
import * as Pagination from '../pagination';
import * as Media from '../media';
import * as Upload from '../upload';
import { createApolloServerConfig, createContextGetter } from '..';

export const createTestHelpers = (models) => {
  const serverConfig = createApolloServerConfig({
    Node,
    Pagination,
    Media,
    Upload,
    ...models,
  });

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
