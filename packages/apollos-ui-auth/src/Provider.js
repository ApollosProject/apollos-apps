import React from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import { ApolloConsumer } from '@apollo/client';
import gql from 'graphql-tag';
import { track } from '@apollosproject/ui-analytics';
import { GET_PUSH_ID, updatePushId } from '@apollosproject/ui-notifications';
import { LoginProvider } from './LoginProvider';
import { GET_LOGIN_STATE } from './queries';

const defaultContext = {
  navigateToAuth: () => {},
  closeAuth: () => {},
};

const AuthContext = React.createContext(defaultContext);

export const GET_AUTH_TOKEN = gql`
  query authToken {
    authToken @client
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
      client.clearStore();
      AsyncStorage.removeItem('authToken');
      track({ eventName: 'UserLogout', client });
      return null;
    },

    handleLogin: async (root, { authToken }, { cache, client }) => {
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

        const { data: { pushId } = { data: {} } } = await client.query({
          query: GET_PUSH_ID,
        });

        if (pushId) {
          updatePushId({ pushId, client });
        }

        track({ eventName: 'UserLogin', client });
      } catch (e) {
        throw e.message;
      }

      return null;
    },
  },
};

const Provider = ({ children, ...authContext }) => (
  <AuthContext.Provider value={{ ...defaultContext, ...authContext }}>
    <LoginProvider {...defaultContext} {...authContext}>
      <ApolloConsumer>
        {(client) => {
          client.addResolvers(resolvers);
          return children;
        }}
      </ApolloConsumer>
    </LoginProvider>
  </AuthContext.Provider>
);

Provider.propTypes = {
  children: PropTypes.node,
  navigateToAuth: PropTypes.func,
  closeAuth: PropTypes.func,
};

Provider.defaultProps = {};

export const AuthConsumer = AuthContext.Consumer;

export default Provider;
