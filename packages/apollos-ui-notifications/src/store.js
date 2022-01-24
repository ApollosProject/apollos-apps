import { gql } from '@apollo/client';

export const defaults = {
  pushId: null,
};

export const resolvers = {
  Mutation: {
    updateDevicePushId: async (root, { pushId }, { cache }) => {
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

      return null;
    },
  },
};
