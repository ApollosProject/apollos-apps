import { ApolloServer } from 'apollo-server-express';
import express from 'express';

import {
  resolvers,
  schema,
  testSchema,
  context,
  dataSources,
  applyServerMiddleware,
} from './data';

export { resolvers, schema, testSchema };

const apolloServer = new ApolloServer({
  typeDefs: schema,
  resolvers,
  dataSources,
  context,
  introspection: true,
  formatError: (error) => {
    console.error(error.extensions.exception.stacktrace.join('\n'));
    return error;
  },
  playground: {
    settings: {
      'editor.cursorShape': 'line',
    },
  },
  cacheControl: {
    stripFormattedExtensions: false,
    calculateHttpHeaders: true,
    defaultMaxAge: 600,
  },
});

const app = express();

apolloServer.applyMiddleware({ app });
applyServerMiddleware({ app, dataSources, context });

export default app;
