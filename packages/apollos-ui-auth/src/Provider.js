import React from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { track } from '@apollosproject/ui-analytics';
import getLoginState from './getLoginState';

// const schema = gql`
// extend type Query {
//   authToken: String
//   isLoggedIn: Boolean
// }

// extend type Mutation {
//   logout
//   handleLogin(authToken: String!)
// }
// `;

const AuthContext = React.createContext({ navigateToAuth: () => {} });

export const getAuthToken = gql`
  query authToken {
    authToken @client
  }
`;

export const resolvers = {
  Query: {
    authToken: () => AsyncStorage.getItem('authToken'),
    isLoggedIn: (_root, _args, { cache }) => {
      // When logging out, this query returns an error.
      // Rescue the error, and return false.
      try {
        const { authToken } = cache.readQuery({ query: getAuthToken });
        return !!authToken;
      } catch (e) {
        return false;
      }
    },
  },
  Mutation: {
    logout: (_root, _args, { client }) => {
      client.resetStore();
      track({ eventName: 'UserLogout', client });
      return null;
    },

    handleLogin: async (root, { authToken }, { cache, client }) => {
      try {
        await AsyncStorage.setItem('authToken', authToken);

        await cache.writeQuery({
          query: getAuthToken,
          data: { authToken },
        });
        await cache.writeQuery({
          query: getLoginState,
          data: { isLoggedIn: true },
        });
        await cache.writeData({
          data: { authToken },
        });

        // TODO: const { pushId } = cache.readQuery({
        //   query: gql`
        //     query {
        //       pushId
        //     }
        //   `,
        // });
        // TODO: if (pushId) {
        //   updatePushId({ pushId });
        // }

        track({ eventName: 'UserLogin', client });
      } catch (e) {
        throw e.message;
      }

      return null;
    },
  },
};

const Provider = ({ children, navigateToAuth }) => (
  <AuthContext.Provider value={{ navigateToAuth }}>
    <ApolloConsumer>
      {(client) => {
        client.addResolvers(resolvers);
        return children;
      }}
    </ApolloConsumer>
  </AuthContext.Provider>
);

Provider.propTypes = {
  children: PropTypes.node,
  navigateToAuth: PropTypes.func,
};

Provider.defaultProps = {
  navigateToAuth: () => {},
};

export const AuthConsumer = AuthContext.Consumer;

export default Provider;
