import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import { authSchema } from '@apollosproject/data-schema';
import { Person } from '@apollosproject/data-connector-rock';
import { createGlobalId } from '@apollosproject/server-core';
import gql from 'graphql-tag';

import { generateToken } from '@apollosproject/data-connector-rock/lib/auth';
import * as Pass from './index';

class AuthDataSourceMock {
  initialize = () => {};

  getCurrentPerson = () => ({
    id: 51,
    firstName: 'Isaac',
    lastName: 'Hardy',
    nickName: 'Isaac',
    email: 'isaac.hardy@newspring.cc',
    photo: {
      url:
        'https://apollosrock.newspring.cc:443/GetImage.ashx?guid=60fd5f35-3167-4c26-9a30-d44937287b87',
    },
  });

  getCurrentPersonAlternateLookupId = () => '0faad2f-3258f47';
}

const Auth = {
  schema: authSchema,
  dataSource: AuthDataSourceMock,
  resolver: { Query: { currentUser: () => ({ profile: { id: 51 } }) } },
};

const { getContext, getSchema } = createTestHelpers({
  Pass,
  Person,
  Auth,
  Theme: {
    schema: gql`
      scalar Color
    `,
  },
});

describe('Passes', () => {
  let schema;
  let context;
  beforeEach(() => {
    schema = getSchema();
    context = getContext();

    fetch.resetMocks();
    fetch.mockLiveDataSourceApis();
  });

  describe('as a logged in user', () => {
    beforeEach(() => {
      const token = generateToken({ cookie: 'some-cookie', sessionId: 123 });
      context = getContext({
        req: {
          headers: { authorization: token },
        },
      });
    });

    it('queries by node', async () => {
      const id = createGlobalId('EXAMPLE', 'Pass');
      const query = `
        query {
          node(id: "${id}") {
            ...on Pass {
              id
              type
              description
              logo { uri }
              thumbnail { uri }
              barcode { uri }
              primaryFields {
                key
                label
                value
                textAlignment
              }
              secondaryFields {
                key
                label
                value
                textAlignment
              }
              backgroundColor
              foregroundColor
              labelColor
              logoText
              passkitFileUrl
            }
          }
        }
      `;
      const rootValue = {};

      console.log({ context });

      const result = await graphql(schema, query, rootValue, context);
      expect(result).toMatchSnapshot();
    });

    it('returns the checkin pass', async () => {
      const query = `
        query {
          userPass {
            id
            type
            description
            logo { uri }
            thumbnail { uri }
            barcode { uri }
            primaryFields {
              key
              label
              value
              textAlignment
            }
            secondaryFields {
              key
              label
              value
              textAlignment
            }
            backgroundColor
            foregroundColor
            labelColor
            logoText
            passkitFileUrl
          }
        }
      `;
      const rootValue = {};
      const result = await graphql(schema, query, rootValue, context);
      expect(result).toMatchSnapshot();
    });
  });
});
