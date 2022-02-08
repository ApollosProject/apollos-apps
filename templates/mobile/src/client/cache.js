import { InMemoryCache } from '@apollo/client/cache';
import AsyncStorage from '@react-native-community/async-storage';
import { CachePersistor } from 'apollo3-cache-persist';
import ApollosConfig from '@apollosproject/config';
import fragmentTypes from '../../fragmentTypes.json';

// We reset our apollo cache based an env value and static number.
// In the future, we should also look at resetting the app when an error occurs related to Apollo.
// You can also increment this number to force a manual reset of the cache.
const SCHEMA_VERSION = `${ApollosConfig.SCHEMA_VERSION}-1`; // Must be a string.
const SCHEMA_VERSION_KEY = 'apollo-schema-version';
const possibleTypes = {};
fragmentTypes.__schema.types.forEach((supertype) => {
  if (supertype.possibleTypes) {
    possibleTypes[supertype.name] = [
      ...supertype.possibleTypes.map((subtype) => subtype.name),
    ];
  }
});

const cache = new InMemoryCache({
  possibleTypes,
  cacheRedirects: {
    Query: {
      fields: {
        node: {
          read(_, { args, toReference }) {
            return toReference({
              __typename: args.id.split(':')[0],
              id: args.id,
            });
          },
        },
      },
    },
  },
});

const persistor = new CachePersistor({
  cache,
  storage: AsyncStorage,
});

// 1. If we are on the same schema version, restore the cache.
// 2. If that fails, purge the cache and update the stored version so we don't try and restore agian
// 3. If we are on a new schema version, purge the cache.
// 4. If purging or setting AsyncStorage keys fails (or anything else) we capture the error and log it.

export const ensureCacheHydration = (async () => {
  // We wrap everything in try/catch because crashing on a cache restore is bad
  // 😬
  try {
    const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
    if (currentVersion === SCHEMA_VERSION) {
      // If the current version matches the latest version,
      // we're good to go and can restore the cache.
      try {
        await persistor.restore();
      } catch (restoreError) {
        // If the restore fails, we want to do our best to purge the cache.
        await persistor.purge();
        console.error('Error restoring cache, purging the cache', restoreError);
      }
    } else {
      // Otherwise, we'll want to purge the outdated persisted cache
      // and mark ourselves as having updated to the latest version.
      await persistor.purge();
      await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
    }
  } catch (error) {
    console.error('Error restoring or purging Apollo cache', error);
  }
})();

export default cache;
