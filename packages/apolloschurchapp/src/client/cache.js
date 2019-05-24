import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { AsyncStorage } from 'react-native';
import { CachePersistor } from 'apollo-cache-persist';
import gql from 'graphql-tag';
import introspectionQueryResultData from './fragmentTypes.json';
import hashFile from './schemaHash.json';

export const CACHE_LOADED = gql`
  query {
    cacheLoaded @client
  }
`;

export const MARK_CACHE_LOADED = gql`
  mutation markCacheLoaded {
    cacheMarkLoaded @client
  }
`;

// We reset our apollo cache based on the schema of the apollos API.
// In the future, we should also look at resetting the app when an error occurs related to Apollo.
const SCHEMA_VERSION = hashFile.schemaHash; // Must be a string.
const SCHEMA_VERSION_KEY = 'apollo-schema-version';

const nodeCacheRedirect = (_, { id }, { getCacheKey }) =>
  id ? getCacheKey({ __typename: id.split(':')[0], id }) : null;

const cache = new InMemoryCache({
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  }),
  cacheRedirects: {
    Query: {
      node: nodeCacheRedirect,
    },
  },
});

const persistor = new CachePersistor({
  cache,
  storage: AsyncStorage,
});

export const ensureCacheHydration = (async () => {
  try {
    const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
    if (currentVersion === SCHEMA_VERSION) {
      // If the current version matches the latest version,
      // we're good to go and can restore the cache.
      await persistor.restore();
    } else {
      // Otherwise, we'll want to purge the outdated persisted cache
      // and mark ourselves as having updated to the latest version.
      await persistor.purge();
      await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
    }
  } catch (error) {
    console.error('Error restoring Apollo cache', error);
  }
})();

export default cache;
