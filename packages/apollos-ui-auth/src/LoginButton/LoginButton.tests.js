import React from 'react';
import renderer, { act } from 'react-test-renderer';
import wait from 'waait';

import { Providers } from '@apollosproject/ui-kit';
import { InMemoryCache } from '@apollo/client/cache';
import { MockedProvider } from '@apollo/client/testing';
import AuthProvider, { GET_AUTH_TOKEN } from '../Provider';

import { GET_LOGIN_STATE } from '../queries';
import LoginButton from '.';

export const renderWithApolloData = async (component) => {
  const tree = renderer.create(component);
  await wait(0);
  tree.update(component);
  return tree;
};

// const cache = new InMemoryCache();
describe('LoginButton component', () => {
  it('renders nothing when logged in', async () => {
    const mock = {
      request: {
        query: GET_LOGIN_STATE,
      },
      result: {
        data: { isLoggedIn: true, __typename: 'Query' },
      },
    };

    const navigation = { navigate: jest.fn() };
    const tree = await renderWithApolloData(
      <MockedProvider
        resolvers={{ Query: { isLoggedIn: () => true } }}
      >
        <AuthProvider>
          <Providers>
            <LoginButton navigation={navigation} />
          </Providers>
        </AuthProvider>
      </MockedProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders a LoginButton when logged out', async () => {
    const mock = {
      request: {
        query: GET_LOGIN_STATE,
      },
      result: {
        data: { isLoggedIn: null, __typename: 'Query' },
      },
    };

    const navigation = { navigate: jest.fn() };
    const tree = await renderWithApolloData(
      <MockedProvider mocks={[mock]}>
        <Providers>
          <LoginButton navigation={navigation} />
        </Providers>
      </MockedProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders a LoginButton that is loading', async () => {
    const mock = {
      request: {
        query: GET_LOGIN_STATE,
      },
      result: {
        data: { isLoggedIn: null, __typename: 'Query' },
      },
    };

    const navigation = { navigate: jest.fn() };
    const tree = await renderWithApolloData(
      <MockedProvider mocks={[mock]}>
        <Providers>
          <LoginButton navigation={navigation} loading />
        </Providers>
      </MockedProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
