/* eslint-disable import/prefer-default-export */
import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloClient, createHttpLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import fetch from 'jest-fetch-mock';
import { resolvers } from './Provider';

export const renderWithApolloData = async (component, existingTree) => {
  const tree = existingTree || renderer.create(component);
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
