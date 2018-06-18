import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  defaultDataIdFromObject,
} from 'apollo-cache-inmemory';

const cache = new InMemoryCache({
  dataIdFromObject(obj) {
    // eslint-disable-next-line no-underscore-dangle
    if (obj.entryId) return `${obj.__typename}:${obj.entryId}`;
    return defaultDataIdFromObject(obj);
  },
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData: JSON.parse(
      '{"__schema":{"types":[{"kind":"INTERFACE","name":"Node","possibleTypes":[{"name":"ContentChannel"},{"name":"UniversalContentItem"},{"name":"Person"}]},{"kind":"INTERFACE","name":"ContentItem","possibleTypes":[{"name":"UniversalContentItem"}]}]}}'
    ),
  }),
  cacheRedirects: {
    Query: {
      node: (root, { id }, { getCacheKey }) =>
        getCacheKey({ __typename: 'Content', id }),
    },
  },
});

export default cache;
