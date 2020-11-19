import React from 'react';

import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client/cache';
import AuthProvider, { GET_AUTH_TOKEN } from '../Provider';

import LoginButton from '.';

describe('LoginButton component', () => {
  it('renders nothing when logged in', async () => {
    const cache = new InMemoryCache();
    cache.writeQuery({
      query: GET_AUTH_TOKEN,
      data: { authToken: 'some-auth-token' },
    });

    const navigation = { navigate: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} cache={cache}>
        <AuthProvider>
          <LoginButton navigation={navigation} />
        </AuthProvider>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders a LoginButton when logged out', async () => {
    const cache = new InMemoryCache();
    cache.writeQuery({ query: GET_AUTH_TOKEN, data: { authToken: null } });

    const navigation = { navigate: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} cache={cache}>
        <AuthProvider>
          <LoginButton navigation={navigation} />
        </AuthProvider>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders a LoginButton that is loading', async () => {
    const cache = new InMemoryCache();
    cache.writeQuery({ query: GET_AUTH_TOKEN, data: { authToken: null } });

    const navigation = { navigate: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} cache={cache}>
        <AuthProvider>
          <LoginButton navigation={navigation} loading />
        </AuthProvider>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
