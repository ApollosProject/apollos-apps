import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-kit';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { resolvers } from '../../Provider';
import LoginForm from './Form';

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: createHttpLink({ fetch: jest.fn() }),
  cache,
  resolvers,
});

describe('The LoginForm component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <ApolloProvider client={client}>
        <Providers>
          <LoginForm
            values={{ email: '', password: '' }}
            touched={{ email: false, password: false }}
            errors={{ email: null, password: null }}
            handleForgotPassword={() => null}
          />
        </Providers>
      </ApolloProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
