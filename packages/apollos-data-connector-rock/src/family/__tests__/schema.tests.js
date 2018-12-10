import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';

import ApollosConfig from '@apollosproject/config';
import {
  peopleSchema,
  mediaSchema,
  authSchema,
} from '@apollosproject/data-schema';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import { generateToken } from '../../auth';
import { Person, Family } from '../..';
// we import the root-level schema and resolver so we test the entire integration:
import authMock from '../../authMock';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
});

const Auth = {
  schema: authSchema,
  dataSource: authMock,
  resolver: { Query: { currentUser: () => ({ profile: { id: 51 } }) } },
};

const { getContext, getSchema } = createTestHelpers({ Person, Family, Auth });

describe('Family', () => {
  let schema;
  let context;
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockRockDataSourceAPI();
    schema = getSchema([peopleSchema, mediaSchema]);
    const token = generateToken({
      cookie: 'some-cookie',
      sessionId: 'somessessionid',
    });
    context = getContext({ req: { headers: { authorization: token } } });
  });

  it("returns a user's location", async () => {
    const query = `
      query {
        currentUser {
          profile {
            location
          }
        }
      }
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
