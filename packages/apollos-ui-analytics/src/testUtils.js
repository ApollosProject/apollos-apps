import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import AnalyticsProvider from './Provider';

const cache = new InMemoryCache();

export const trackMock = jest.fn();

const client = new ApolloClient({
  link: createHttpLink({ fetch: jest.fn() }),
  cache,
  resolvers: {},
});

export const wait = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));

// eslint-disable-next-line
export const ProviderStack = ({ children }) => (
  <ApolloProvider client={client}>
    <AnalyticsProvider trackFunctions={[trackMock]}>
      {children}
    </AnalyticsProvider>
  </ApolloProvider>
);
