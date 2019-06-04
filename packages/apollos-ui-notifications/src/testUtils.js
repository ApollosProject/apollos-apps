/* eslint-disable import/prefer-default-export */
import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
import { MockedProvider } from 'react-apollo/test-utils';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'jest-fetch-mock';
import { resolvers } from './store';

export const renderWithApolloData = async (component) => {
  const tree = renderer.create(component);
  await wait(1);
  tree.update(component);
  return tree;
};

// eslint-disable-next-line
export const Providers = ({ children, ...props }) => (
  <UIProviders {...props}>
    <MockedProvider {...props}>{children}</MockedProvider>
  </UIProviders>
);

const cache = new InMemoryCache();

export const client = new ApolloClient({
  link: createHttpLink({ fetch }),
  cache,
  resolvers,
});
