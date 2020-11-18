import React from 'react';

import { Providers } from '@apollosproject/ui-kit';
import { ApolloProvider, ApolloClient, createHttpLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
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
    <Providers>
      <AnalyticsProvider trackFunctions={[trackMock]}>
        {children}
      </AnalyticsProvider>
    </Providers>
  </ApolloProvider>
);
