import gql from 'graphql-tag';
import fetch from 'jest-fetch-mock';
import { ApolloClient, createHttpLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { getPushPermissions, getHasPrompted } from './permissionUtils';
import { resolvers, defaults } from './store';

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: createHttpLink({ fetch }),
  cache,
  resolvers,
});

const GET_PUSH_ID = gql`
  query {
    pushId @client
  }
`;

client.writeQuery({ query: GET_PUSH_ID, data: defaults });

describe('getPushPermissions', () => {
  it('should return a boolean based on the result from OneSignal', async () => {
    const result = await getPushPermissions();
    expect(result).toEqual(true);
  });
});

describe('getHasPrompted', () => {
  it('should return a boolean based on the result from OneSignal', async () => {
    const result = await getHasPrompted();
    expect(result).toEqual(true);
  });
});
