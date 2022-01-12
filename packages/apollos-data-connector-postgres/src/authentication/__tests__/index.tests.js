import { graphql } from 'graphql';
import { dataSource as ConfigDataSource } from '@apollosproject/config';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import {
  authSchema,
  contentChannelSchema,
  contentItemSchema,
  featuresSchema,
  followSchema,
  scriptureSchema,
  themeSchema,
  authenticationSchema,
} from '@apollosproject/data-schema';

import * as Authentication from '../index';
import * as Person from '../../people/index';
import * as RefreshToken from '../../refresh-tokens/index';

import { generateToken } from '../token';

class CacheMock {
  get = jest.fn();

  set = jest.fn();
}

const Cache = { dataSource: CacheMock };

const { getContext, getSchema } = createTestHelpers({
  Authentication,
  Person,
  Cache,
  RefreshToken,
  Config: { dataSource: ConfigDataSource },
});

describe('Auth', () => {
  let schema;
  let context;
  beforeEach(async () => {
    schema = getSchema([
      authSchema,
      contentChannelSchema,
      contentItemSchema,
      featuresSchema,
      followSchema,
      scriptureSchema,
      themeSchema,
      authenticationSchema,
    ]);

    context = await getContext(
      { req: { headers: { 'x-church': 'apollos_demo' } } },
      { church: { slug: 'apollos_demo' } }
    );
  });

  describe('Refresh Session', () => {
    it('refreshes a user session', async () => {
      const personId = 'person';
      const refreshToken = 'testToken';
      const mutation = `
        mutation {
          refreshSession(refreshToken: "${refreshToken}") {
            accessToken
            refreshToken
          }
        }
      `;

      const getValidTokenMock = jest.fn(() => Promise.resolve({ personId }));

      context.dataSources.RefreshToken.getValidToken = getValidTokenMock;
      const accessToken = generateToken({ personId });

      const rootValue = {};

      const {
        data: { refreshSession },
      } = await graphql(schema, mutation, rootValue, context);
      expect(refreshSession.accessToken).toEqual(accessToken);
      expect(refreshSession.refreshToken).toEqual(refreshToken);
    });
  });
});
