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

/**
 * Mocks an empty state for a relay style paginated object
 * @returns {Object}
 */
function makeEmptyData() {
  return {
    edges: [],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: true,
      startCursor: '',
      endCursor: '',
    },
  };
}

/**
 * Gets the cursor for an edge at a given index
 * @param {Object[]} edges
 * @param {number} index
 * @returns {string}
 */
function cursorFromEdge(edges, index) {
  if (index < 0) {
    index += edges.length;
  }
  const edge = edges[index];
  return (edge && edge.cursor) || '';
}

/**
 * Creates the necessary `merge` and `read` fields for a relay-style pagination.
 *
 * Assumes that the page information is set in the form of object inside of args called `query` with properties `first` and `after`
 * @returns {{ merge: function, read: function }}
 */
function relayStylePagination() {
  return {
    read(existing, { canRead }) {
      if (!existing) {
        return;
      }
      const edges = existing.edges.filter((edge) => canRead(edge.node));
      return {
        // Some implementations return additional Connection fields, such
        // as existing.totalCount. These fields are saved by the merge
        // function, so the read function should also preserve them.
        ...existing,
        edges,
        pageInfo: {
          ...existing.pageInfo,
          startCursor: cursorFromEdge(edges, 0),
          endCursor: cursorFromEdge(edges, -1),
        },
      };
    },
    merge(existing = makeEmptyData(), incoming, { args }) {
      const query = args?.query;
      if (!query) {
        return {
          ...existing,
          /**
           * in case we're manually updating the total count after a mutation, we'll end up with a new total count with no changes to Edges for UI reasons (see useFollowPerson.js)
           */
          totalCount: incoming?.totalCount ?? existing?.totalCount,
        };
      }

      const incomingEdges = incoming.edges.slice(0);

      let prefix = existing.edges;
      let suffix = [];

      if (query.after) {
        const index = prefix.findIndex((edge) => edge.cursor === query.after);
        if (index >= 0) {
          prefix = prefix.slice(0, index + 1);
          // suffix = []; // already true
        }
      } else {
        // If we have neither args.after nor args.before, the incoming
        // edges cannot be spliced into the existing edges, so they must
        // replace the existing edges. See #6592 for a motivating example.
        prefix = [];
      }

      const edges = [...prefix, ...incomingEdges, ...suffix];

      const pageInfo = {
        ...incoming.pageInfo,
        ...existing.pageInfo,
        startCursor: cursorFromEdge(edges, 0),
        endCursor: cursorFromEdge(edges, -1),
      };

      return {
        ...existing,
        ...incoming,
        edges,
        pageInfo,
      };
    },
  };
}

const cache = new InMemoryCache({
  possibleTypes,
  typePolicies: {
    AppTab: {
      // We don't store tabs using an ID, but instead a Title
      keyFields: ['title'],
    },
    Person: {
      fields: {
        following: relayStylePagination(),
        followedBy: relayStylePagination(),
      },
    },
  },
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
