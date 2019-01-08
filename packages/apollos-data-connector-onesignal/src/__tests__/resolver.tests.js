import { graphql } from 'graphql';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import { peopleSchema } from '@apollosproject/data-schema';
import * as OneSignal from '../index';

const { getContext, getSchema } = createTestHelpers({ OneSignal });

describe('OneSignal', () => {
  let schema;
  let context;
  beforeEach(() => {
    schema = getSchema([peopleSchema]);
    context = getContext();
  });

  it('updates an external push id with a valid user', async () => {
    const query = `
      mutation updatePushId {
        updateUserPushSettings(input: { pushProviderUserId: "some-push-id" }) {
          id
        }
      }
    `;
    const rootValue = {};

    const put = jest.fn();
    const getCurrentPerson = jest.fn(() => Promise.resolve({ id: 'user123' }));
    const Auth = { getCurrentPerson };

    context.dataSources.OneSignal.put = put;
    context.dataSources.Auth = Auth;

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(put).toMatchSnapshot();
  });
});
