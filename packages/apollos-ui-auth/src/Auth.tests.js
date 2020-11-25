// import React from 'react';
// import renderer from 'react-test-renderer';
import { createHttpLink, ApolloClient } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';

import { resolvers, GET_AUTH_TOKEN } from './Provider';

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: createHttpLink({ fetch: jest.fn() }),
  cache,
  // resolvers,
});

describe('Auth Store', () => {
  it('logs a user out', async () => {
    client.cache.writeQuery({
      query: GET_AUTH_TOKEN,
      data: { authToken: 'some-auth-token' },
    });
    resolvers.Mutation.logout({}, {}, { cache: client.cache, client });
    expect(client.cache).toMatchSnapshot();
  });
});
