/* eslint-disable default-case, no-restricted-syntax */
import ApollosConfig from '@apollosproject/config';
import { onError } from '@apollo/client/link/error';
import { fromPromise } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import fetch from 'node-fetch';

const getNewToken = async ({ url, headers: oldHeaders }) => {
  const headers = oldHeaders;
  delete headers.Authorization;
  delete headers.authorization;
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      ...(ApollosConfig.CHURCH_HEADER
        ? { 'x-church': ApollosConfig.CHURCH_HEADER }
        : {}),
    },
    body: JSON.stringify({
      query: `
      mutation token($refreshToken: String!) {
        refreshSession(refreshToken: $refreshToken){
          accessToken
          refreshToken
        }
      }
      `,
      variables: { refreshToken },
    }),
  }).then((res) => res.json());
  const { accessToken } = result.data.refreshSession;
  await AsyncStorage.setItem('accessToken', accessToken);
  return accessToken;
};

const buildErrorLink = (onAuthError, url) =>
  onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        switch (err.extensions.code) {
          case 'UNAUTHENTICATED':
            return fromPromise(
              getNewToken({
                url,
                headers: operation.getContext().headers,
              }).catch(() => {
                onAuthError();
              })
            )
              .filter((value) => Boolean(value))
              .flatMap((accessToken) => {
                const oldHeaders = operation.getContext().headers;
                // modify the operation context with a new token
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${accessToken}`,
                  },
                });
                // retry the request, returning the new observable
                return forward(operation);
              });
        }
      }
    }
    return null;
  });

export default buildErrorLink;
