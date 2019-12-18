import gql from 'graphql-tag';
import { GET_LOGIN_STATE } from '@apollosproject/ui-auth';
import updatePushId from './updatePushId';

export const defaults = {
  pushId: null,
};

export const resolvers = {
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
  },
};
