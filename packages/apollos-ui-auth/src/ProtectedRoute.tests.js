import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import wait from 'waait';

import { Providers } from '@apollosproject/ui-kit';
import { InMemoryCache } from '@apollo/client/cache';
import { MockedProvider } from '@apollo/client/testing';
import AuthProvider, { GET_AUTH_TOKEN } from './Provider';

import ProtectedRoute from './ProtectedRoute';
import getLoginStateWithCacheLoaded from './getLoginStateWithCacheLoaded';

const setLoginState = async ({ cache, isLoggedIn }) => {
  await cache.writeQuery({
    query: getLoginStateWithCacheLoaded,
    data: { isLoggedIn, cacheLoaded: true },
  });
  if (isLoggedIn) {
    await cache.writeQuery({
      query: GET_AUTH_TOKEN,
      data: { authToken: 'test' },
    });
  }
};

let cache;
describe('ProtectedRoute component', () => {
  beforeEach(() => {
    cache = new InMemoryCache();
  });

  it('navigates to the logged in route when logged in', async () => {
    const navigateMock = jest.fn();
    const navigation = { replace: navigateMock };
    await setLoginState({ cache, isLoggedIn: true });

    const tree = renderer.create(
      <MockedProvider cache={cache}>
        <AuthProvider>
          <Providers>
            <ProtectedRoute loggedInRouteName="Home" navigation={navigation} />
          </Providers>
        </AuthProvider>
      </MockedProvider>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
    expect(navigateMock.mock.calls).toMatchSnapshot();
  });

  it('navigates to the auth route when logged out', async () => {
    const navigateMock = jest.fn();
    const navigation = { replace: navigateMock };
    await setLoginState({ cache, isLoggedIn: false });

    const tree = renderer.create(
      <MockedProvider cache={cache}>
        <AuthProvider>
          <Providers>
            <ProtectedRoute
              loggedOutRouteName="AuthFoo"
              navigation={navigation}
            />
          </Providers>
        </AuthProvider>
      </MockedProvider>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
    expect(navigateMock.mock.calls).toMatchSnapshot();
  });

  it('renders a custom loading component', async () => {
    const navigateMock = jest.fn();
    const navigation = { replace: navigateMock };

    const tree = renderer.create(
      <MockedProvider cache={cache}>
        <AuthProvider>
          <Providers>
            <ProtectedRoute
              LoadingIndicator={<View />}
              navigation={navigation}
            />
          </Providers>
        </AuthProvider>
      </MockedProvider>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
    expect(navigateMock.mock.calls).toMatchSnapshot();
  });
});
