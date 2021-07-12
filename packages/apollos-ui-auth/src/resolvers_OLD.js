import AsyncStorage from '@react-native-community/async-storage';
import gql from 'graphql-tag';
import { track } from '@apollosproject/ui-analytics';
import { GET_LOGIN_STATE } from './queries';

export const GET_AUTH_TOKEN = gql`
  query authToken {
    authToken @client
  }
`;

export const LOGOUT = gql`
  mutation {
    logout @client
  }
`;

export const HANDLE_LOGIN = gql`
  mutation handleLogin($authToken: String!) {
    handleLogin(authToken: $authToken) @client
  }
`;

export const resolvers = {
  Query: {
    authToken: () => AsyncStorage.getItem('authToken'),
    isLoggedIn: async (_root, _args, { client }) => {
      // When logging out, this query returns an error.
      // Rescue the error, and return false.
      try {
        const { data } = await client.query({ query: GET_AUTH_TOKEN });
        return !!data.authToken;
      } catch (e) {
        return false;
      }
    },
  },
  Mutation: {
    logout: async (_root, _args, { client }) => {
      console.warn('logout mutation deprecated, use logout(client) instead');
      client.clearStore();
      AsyncStorage.removeItem('authToken');
      track({ eventName: 'UserLogout', client });
      return null;
    },

    handleLogin: async (root, { authToken }, { cache, client }) => {
      console.warn(
        'handleLogin mutation deprecated, use login(client, authToken) instead'
      );
      try {
        await AsyncStorage.setItem('authToken', authToken);

        await cache.writeQuery({
          query: GET_AUTH_TOKEN,
          data: { authToken },
        });
        await cache.writeQuery({
          query: GET_LOGIN_STATE,
          data: { isLoggedIn: true },
        });

        // shouldn't import the client query or push mutations from
        // ui-notifications because that package already depends on login
        // state from this package
        const { data: { pushId } = { data: {} } } = await client.query({
          query: gql`
            query {
              pushId @client
            }
          `,
        });

        if (pushId) {
          client.mutate({
            mutation: gql`
              mutation updateUserPushSettings($input: PushSettingsInput!) {
                updateUserPushSettings(input: $input) {
                  id
                }
              }
            `,
            variables: { input: { pushProviderUserId: pushId } },
          });
        }

        track({ eventName: 'UserLogin', client });
      } catch (e) {
        throw e.message;
      }

      return null;
    },
  },
};
