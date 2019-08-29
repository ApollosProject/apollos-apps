// import React from 'react';
// import renderer from 'react-test-renderer';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

import { resolvers } from './Provider';

// import Auth from '.';

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: createHttpLink({ fetch: jest.fn() }),
  cache,
  resolvers,
});

describe('Auth Store', () => {
  it('logs a user out', async () => {
    client.cache.writeData({ data: { authToken: 'some-auth-token' } });
    resolvers.Mutation.logout({}, {}, { cache: client.cache, client });
    expect(client.cache).toMatchSnapshot();
  });
});

// describe('Auth component', () => {
// it('should render', () => {
// const navigation = { getParam: jest.fn(() => true) };
// const tree = renderer.create(<Auth navigation={navigation} />).toJSON();
// expect(tree).toBeTruthy();
// });
// });
