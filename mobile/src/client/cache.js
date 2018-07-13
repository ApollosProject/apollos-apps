import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';

import introspectionQueryResultData from './fragmentTypes.json';

const cache = new InMemoryCache({
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  }),
  cacheRedirects: {
    Query: {
      node: (_, { id }, { getCacheKey }) =>
        getCacheKey({ __typename: id.split(':')[0], id }),
    },
  },
});

export default cache;
