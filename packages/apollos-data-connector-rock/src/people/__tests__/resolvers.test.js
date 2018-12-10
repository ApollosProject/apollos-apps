import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import ApollosConfig from '@apollosproject/config';
import { createGlobalId } from '@apollosproject/server-core';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import {
  peopleSchema,
  mediaSchema,
  authSchema,
} from '@apollosproject/data-schema';
import { generateToken, registerToken } from '../../auth';
// we import the root-level schema and resolver so we test the entire integration:
import * as Person from '../index';
import authMock from '../../authMock';

const Auth = { schema: authSchema, dataSource: authMock };
const { getContext, getSchema } = createTestHelpers({ Person, Auth });

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
});

describe('Person', () => {
  let schema;
  let context;
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockRockDataSourceAPI();
    schema = getSchema([peopleSchema, mediaSchema]);
    context = getContext();
  });

  it("updates a user's attributes, if there is a current user", async () => {
    const query = `
      mutation {
        updateProfileField(input: { field: FirstName, value: "Richard" }) {
          firstName
          id
        }
      }
    `;
    const { userToken, rockCookie } = registerToken(
      generateToken({ cookie: 'some-cookie' })
    );
    context.userToken = userToken;
    context.rockCookie = rockCookie;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('updates multiple fields', async () => {
    const query = `
      mutation {
        updateProfileFields(input: [
          { field: FirstName, value: "Richard" },
          { field: LastName, value: "Walkerton" }
        ]) {
          firstName
          lastName
          id
        }
      }
    `;
    const { userToken, rockCookie } = registerToken(
      generateToken({ cookie: 'some-cookie' })
    );
    context.userToken = userToken;
    context.rockCookie = rockCookie;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it("fails to update a user's attributes, without a current user", async () => {
    const query = `
      mutation {
        updateProfileField(input: { field: FirstName, value: "Richard" }) {
          firstName
          id
        }
      }
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets people by an email', async () => {
    const query = `
      query {
        people(email: "isaac.hardy@newspring.cc") {
          id
          firstName
          lastName
          nickName
          email
          photo {
            uri
          }
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('gets a single person when querying by root node', async () => {
    const query = `
      query {
        node(
          id: "${createGlobalId(51, 'Person')}"
        ) {
          ... on Person {
            id
            firstName
            lastName
            nickName
            email
            photo {
              uri
            }
          }
        }
      }
    `;
    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});
