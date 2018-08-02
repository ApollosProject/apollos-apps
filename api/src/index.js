import dotenv from 'dotenv/config'; // eslint-disable-line
import { ApolloServer } from 'apollo-server';
import { resolvers, schema, dataSources } from './data';

import getContext from './getContext';

console.log(getContext());
export default new ApolloServer({
  typeDefs: schema,
  resolvers,
  dataSources: () => ({
    liveStream: new dataSources.LiveStream(),
    scripture: new dataSources.ESVScripture(),
  }),
  context: getContext,
  formatError: (error) => {
    console.error(error.extensions.exception.stacktrace.join('\n'));
    return error;
  },
});
