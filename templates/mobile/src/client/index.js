import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider, ApolloClient, ApolloLink, gql } from '@apollo/client';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'react-native-sha256';
import { getVersion, getApplicationName } from 'react-native-device-info';
import { Platform } from 'react-native';
import { createUploadLink } from 'apollo-upload-client';
import ApollosConfig from '@apollosproject/config';
import AsyncStorage from '@react-native-community/async-storage';

import { authLink, buildErrorLink } from '@apollosproject/ui-authentication';
// import { updatePushId } from '@apollosproject/ui-notifications';

import { NavigationService } from '@apollosproject/ui-kit';

import cache, { ensureCacheHydration } from './cache';

const wipeData = () =>
  cache.writeQuery({
    query: gql`
      query {
        isLoggedIn @client
        cacheLoaded @client
      }
    `,
    data: {
      __typename: 'Query',
      cacheLoaded: false,
      isLoggedIn: false,
    },
  });

let storeIsResetting = false;
const onAuthError = async () => {
  AsyncStorage.removeItem('accessToken');
  AsyncStorage.removeItem('refreshToken');
  if (!storeIsResetting) {
    storeIsResetting = true;
    await client.stop();
    await client.clearStore();
  }
  storeIsResetting = false;
  NavigationService.resetToAuth();
};

// Android's emulator requires localhost network traffic to go through 10.0.2.2
const uri = ApollosConfig.APP_DATA_URL.replace(
  'localhost',
  Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
);

const errorLink = buildErrorLink(onAuthError, uri);
const apqLink = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true,
});

const link = ApolloLink.from([
  authLink,
  errorLink,
  apqLink,
  createUploadLink({
    uri,
    headers: {
      // Stops Fetch (and the underlying HTTP stack) from caching on our behalf.
      // Caching should be managed by our server and apollo-client
      // Fetch handles the `cache-control: private` option in a way that
      // causes issues when logging in as a different user.
      'Cache-Control': 'no-cache, no-store',
      ...(ApollosConfig.CHURCH_HEADER
        ? { 'x-church': ApollosConfig.CHURCH_HEADER }
        : {}),
    },
  }),
]);

export const client = new ApolloClient({
  link,
  cache,
  queryDeduplication: false,
  shouldBatch: true,
  name: getApplicationName(),
  version: getVersion(),
  defaultOptions: {
    watchQuery: {
      nextFetchPolicy(lastFetchPolicy) {
        if (
          lastFetchPolicy === 'cache-and-network' ||
          lastFetchPolicy === 'network-only'
        ) {
          return 'cache-first';
        }
        return lastFetchPolicy;
      },
    },
  },
});

wipeData();
// Ensure that media player still works after logout.
client.onClearStore(() => wipeData());

const ClientProvider = ({ children }) => {
  useEffect(() => {
    const initialize = async () => {
      await ensureCacheHydration;
      client.writeQuery({
        query: gql`
          query {
            cacheLoaded @client
          }
        `,
        data: {
          cacheLoaded: true,
        },
      });
    };
    initialize();
  }, []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

ClientProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.object, // covers Fragments
  ]).isRequired,
};

export default ClientProvider;
