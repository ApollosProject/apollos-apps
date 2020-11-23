import { ApolloClient, createHttpLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import fetch from 'jest-fetch-mock';
import { resolvers } from './Provider';

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: createHttpLink({ fetch }),
  cache,
  resolvers,
});

export { client as default };
