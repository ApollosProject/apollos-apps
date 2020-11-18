import gql from 'graphql-tag';
import { client } from './testUtils';
import { getPushPermissions, getHasPrompted } from './permissionUtils';
import { defaults } from './store';

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
