import gql from 'graphql-tag';
import { Platform } from 'react-native';
import { GET_LOGIN_STATE } from '@apollosproject/ui-auth';
import {
  GET_NOTIFICATIONS_ENABLED,
  getPushPermissions,
} from './permissionUtils';
import updatePushId from './updatePushId';

export const defaults = {
  pushId: null,
  notificationsEnabled: Platform.OS === 'android',
};

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
        query: GET_LOGIN_STATE,
      });

      if (isLoggedIn) {
        updatePushId({ pushId, client });
      }
      return null;
    },
    updatePushPermissions: (root, { enabled }, { cache }) => {
      cache.writeQuery({
        query: GET_NOTIFICATIONS_ENABLED,
        data: {
          notificationsEnabled: enabled,
        },
      });

      return null;
    },
  },
};
