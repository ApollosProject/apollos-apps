import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import { Providers } from '@apollosproject/ui-kit';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { MockedProvider } from 'react-apollo/test-utils';
import AuthProvider, { GET_AUTH_TOKEN } from '../Provider';

import { GET_LOGIN_STATE } from '../queries';
import LoginButton from '.';

const cache = new InMemoryCache();
describe('LoginButton component', () => {
  it('renders nothing when logged in', async () => {
    await cache.writeQuery({
      query: GET_AUTH_TOKEN,
      data: { authToken: 'test' },
    });

    const navigation = { navigate: jest.fn() };
    const tree = renderer.create(
      <MockedProvider cache={cache}>
        <AuthProvider>
          <Providers>
            <LoginButton navigation={navigation} />
          </Providers>
        </AuthProvider>
      </MockedProvider>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });

  it('renders a LoginButton when logged out', async () => {
    const mock = {
      request: {
        query: GET_LOGIN_STATE,
      },
      result: {
        data: { isLoggedIn: null },
      },
    };

    const navigation = { navigate: jest.fn() };
    const tree = renderer.create(
      <MockedProvider mocks={[mock]}>
        <Providers>
          <LoginButton navigation={navigation} />
        </Providers>
      </MockedProvider>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });

  it('renders a LoginButton that is loading', async () => {
    const mock = {
      request: {
        query: GET_LOGIN_STATE,
      },
      result: {
        data: { isLoggedIn: null },
      },
    };

    const navigation = { navigate: jest.fn() };
    const tree = renderer.create(
      <MockedProvider mocks={[mock]}>
        <Providers>
          <LoginButton navigation={navigation} loading />
        </Providers>
      </MockedProvider>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
