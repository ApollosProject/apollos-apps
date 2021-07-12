import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { ApolloConsumer, useApolloClient } from '@apollo/client';
import gql from 'graphql-tag';
import { track } from '@apollosproject/ui-analytics';
import { LoginProvider } from './LoginProvider';
import { GET_LOGIN_STATE } from './queries';
import { resolvers } from './resolvers_OLD';

const defaultContext = {
  navigateToAuth: () => {},
  closeAuth: () => {},
};

const AuthContext = React.createContext(defaultContext);

// TODO convert into useLogin hook once LoginProvider has been made a functional component
// so we can drop the client parameter
export const login = async (client, authToken) => {
  AsyncStorage.setItem('authToken', authToken);
  client.writeQuery({
    query: GET_LOGIN_STATE,
    data: { isLoggedIn: true },
  });

  // update push notification user ID
  //
  // shouldn't import the client query or push mutations from
  // ui-notifications because that package already depends on login
  // state from this package
  const { data } = await client.query({
    query: gql`
      query {
        pushId @client
      }
    `,
  });

  if (data?.pushId) {
    client.mutate({
      mutation: gql`
        mutation updateUserPushSettings($input: PushSettingsInput!) {
          updateUserPushSettings(input: $input) {
            id
          }
        }
      `,
      variables: { input: { pushProviderUserId: data?.pushId } },
    });
  }

  track({ eventName: 'UserLogin', client });
};

export const useLogout = () => {
  const client = useApolloClient();
  const navigation = useNavigation();
  return () => {
    client.clearStore();
    AsyncStorage.removeItem('authToken');
    track({ eventName: 'UserLogout', client });
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth', params: { screen: 'Identity' } }],
    });
  };
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
