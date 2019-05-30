import gql from 'graphql-tag';

import { Platform } from 'react-native';
import { schema as mediaPlayerSchema } from '@apollosproject/ui-media-player';
import { CACHE_LOADED } from '../client/cache'; // eslint-disable-line

import {
  getPushPermissions,
  updatePushId,
  getNotificationsEnabled,
} from '../notifications';
// TODO: this will require more organization...ie...not keeping everything in one file.
// But this is simple while our needs our small.

export const schema = `
  type Query {
    devicePushId: String
    cacheLoaded: Boolean
    notificationsEnabled: Boolean
  }

  type Mutation {
    cacheMarkLoaded
    updateDevicePushId(pushId: String!)
    updatePushPermissions(enabled: Boolean!)
  }
${mediaPlayerSchema}
`;

export const defaults = {
  __typename: 'Query',
  cacheLoaded: false,
  pushId: null,
  notificationsEnabled: Platform.OS === 'android',
};

const getIsLoggedIn = gql`
  query {
    isLoggedIn @client
  }
`;

export const resolvers = {
  Query: {
    notificationsEnabled: getPushPermissions,
  },
  Mutation: {
    updateDevicePushId: async (root, { pushId }, { cache, client }) => {
      const query = gql`
        query {
          pushId @client
        }
      `;
      cache.writeQuery({
        query,
        data: {
          pushId,
        },
      });

      const { data: { isLoggedIn } = {} } = await client.query({
        query: getIsLoggedIn,
      });

      if (isLoggedIn) {
        updatePushId({ pushId, client });
      }
      return null;
    },
    updatePushPermissions: (root, { enabled }, { cache }) => {
      cache.writeQuery({
        query: getNotificationsEnabled,
        data: {
          notificationsEnabled: enabled,
        },
      });

      return null;
    },

    cacheMarkLoaded: async (root, args, { cache, client }) => {
      cache.writeQuery({
        query: CACHE_LOADED,
        data: {
          cacheLoaded: true,
        },
      });
      const { data: { isLoggedIn } = {} } = await client.query({
        query: getIsLoggedIn,
      });

      const { pushId } = cache.readQuery({
        query: gql`
          query {
            pushId @client
          }
        `,
      });

      if (isLoggedIn && pushId) {
        updatePushId({ pushId, client });
      }
      return null;
    },
  },
};
