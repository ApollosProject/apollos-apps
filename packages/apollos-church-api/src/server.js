import { ApolloServer } from 'apollo-server';

// import { RockLoggingExtension } from '@apollosproject/rock-apollo-data-source';
import { resolvers, schema, testSchema, context, dataSources } from './data';

export { resolvers, schema, testSchema };

export default new ApolloServer({
  typeDefs: schema,
  resolvers,
  dataSources,
  context,
  introspection: true,
  // Uncomment this next line to enable logging of Rock requests.
  // extensions: [() => new RockLoggingExtension()],
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
