import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client';
// import { track } from '@apollosproject/ui-analytics';
import { LoginProvider } from './LoginProvider';

const defaultContext = {
  navigateToAuth: () => {},
  closeAuth: () => {},
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
};

const UPDATE_PUSH_ID = gql`
  mutation updateUserPushSettings($input: PushSettingsInput!) {
    updateUserPushSettings(input: $input) {
      id
    }
  }
`;

export const AuthContext = React.createContext(defaultContext);

export const useIsLoggedIn = () => {
  const ctx = React.useContext(AuthContext);
  return ctx.isLoggedIn;
};

export const useLogout = () => {
  const ctx = React.useContext(AuthContext);
  return ctx.logout;
};

export const useLogin = () => {
  const ctx = React.useContext(AuthContext);
  return ctx.login;
};

const AuthContextProvider = ({ children }) => {
  // Access Token and Refresh token
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();

  const [isLoggedIn, setLoggedIn] = useState(null);

  // We'll need to interface with the Push Module
  // when registering
  const { data: { pushId } = { data: { pushId: null } } } = useQuery(gql`
    query {
      pushId @client
    }
  `);
  const [updatePushId] = useMutation(UPDATE_PUSH_ID);

  const client = useApolloClient();

  // This effect handles initial login.
  useEffect(() => {
    const setInitialTokens = async () => {
      const access = await AsyncStorage.getItem('accessToken');
      setAccessToken(access);
      setRefreshToken(await AsyncStorage.getItem('refreshToken'));
      // We assume that any login token means we are logged in.
      // Long term, we might want to check the validity of that token.
      setLoggedIn(!!access);
    };
    setInitialTokens();
  }, []);

  // When we have both a push ID and are logged in
  // let's inform the API of our pushId.
  useEffect(() => {
    if (pushId && isLoggedIn) {
      updatePushId({ variables: { input: { pushProviderUserId: pushId } } });
    }
  }, [pushId, isLoggedIn]);

  // Callback used for logging in.
  const login = React.useCallback(
    async ({ accessToken: access, refreshToken: refresh }) => {
      await AsyncStorage.setItem('accessToken', access);
      setAccessToken(access);

      await AsyncStorage.setItem('refreshToken', refresh);
      setRefreshToken(refresh);

      setLoggedIn(true);
    },
    []
  );

  // Callback used for logging out.
  const logout = React.useCallback(async () => {
    await client.clearStore();
    await AsyncStorage.removeItem('accessToken');
    setAccessToken(null);

    await AsyncStorage.removeItem('refreshToken');
    setRefreshToken(null);

    setLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        refreshToken,
        accessToken,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const Provider = ({ children, ...authContext }) => (
  <AuthContextProvider>
    <LoginProvider {...defaultContext} {...authContext}>
      {children}
    </LoginProvider>
  </AuthContextProvider>
);

Provider.propTypes = {
  children: PropTypes.node,
  navigateToAuth: PropTypes.func,
  closeAuth: PropTypes.func,
};

AuthContextProvider.propTypes = {
  children: PropTypes.any, // eslint-disable-line
};

Provider.defaultProps = {};

export const AuthConsumer = AuthContext.Consumer;

export default Provider;
