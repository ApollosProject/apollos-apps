import { graphql } from 'graphql';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import { peopleSchema, deviceSchema } from '@apollosproject/data-schema';
import * as OneSignal from '../index';

const { getContext, getSchema } = createTestHelpers({ OneSignal });

describe('OneSignal', () => {
  let schema;
  let context;
  beforeEach(() => {
    schema = getSchema([peopleSchema, deviceSchema]);
    context = getContext();
  });

  it('updates an external push id with a valid user', async () => {
    const query = `
      mutation updatePushId {
        updateUserPushSettings(input: { pushProviderUserId: "some-push-id", enabled: false }) {
          id
        }
      }
    `;
    const rootValue = {};

    context.dataSources = {
      ...context.dataSources,
      Config: {
        ONE_SIGNAL: {
          APP_ID: '123-xyz',
          REST_KEY: 'abcabcabc',
        },
      },
      Person: {
        getFromId: () => Promise.resolve({ id: 'user123' }),
        getCurrentPerson: jest.fn(() => Promise.resolve({ id: 'user123' })),
      },
      PersonalDevice: {
        updateNotificationsEnabled: jest.fn(),
        request: () => ({
          filter: () => ({
            first: () => ({
              primaryAliasId: 'user123',
            }),
          }),
        }),
      },
      OneSignal: {
        put: jest.fn(),
        updatePushSettings: () => ({ id: 'Person:123' }),
      },
    };

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
