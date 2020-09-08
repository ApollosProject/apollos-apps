import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import { AuthenticationError } from 'apollo-server';
import ApollosConfig from '@apollosproject/config';
import { createGlobalId } from '@apollosproject/server-core';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import {
  peopleSchema,
  mediaSchema,
  authSchema,
  deviceSchema,
} from '@apollosproject/data-schema';
import { generateToken, registerToken } from '../../auth';
// we import the root-level schema and resolver so we test the entire integration:
import * as Person from '../index';
import { PersonalDevice } from '../../index';
import authMock from '../../authMock';
import { enforceCurrentUser } from '../../utils';

const Auth = { schema: authSchema, dataSource: authMock };
const { getContext, getSchema } = createTestHelpers({
  Person,
  Auth,
  PersonalDevice,
});

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
    schema = getSchema([peopleSchema, mediaSchema, deviceSchema]);
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

  it("updates a user's gender", async () => {
    const query = `
      mutation {
        updateProfileFields(input: [
          { field: Gender, value: "Male" },
        ]) {
          id
          gender
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
            devices {
              id
              pushId
              notificationsEnabled
            }
          }
        }
      }
    `;

    context.dataSources.PersonalDevice.request = jest.fn(() => ({
      filter: jest.fn(() => ({
        get: jest.fn(() =>
          Promise.resolve([
            {
              id: '1',
              deviceRegistrationId: 'abc-123',
              notificationsEnabled: true,
            },
          ])
        ),
      })),
    }));

    const rootValue = {};
    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });
});

describe('enforceCurrentUser', () => {
  it('will return a field if the queried user is the current user', async () => {
    const context = {
      dataSources: { Auth: { getCurrentPerson: () => ({ id: 1 }) } },
    };
    const resultFunc = enforceCurrentUser(({ firstName }) => firstName);

    const result = await resultFunc(
      { firstName: 'John', id: 1 },
      {},
      context,
      {}
    );
    expect(result).toEqual('John');
  });

  it("won't return a field with no user", async () => {
    const context = {
      dataSources: {
        Auth: { getCurrentPerson: () => throw new AuthenticationError() },
      },
    };
    const resultFunc = enforceCurrentUser(({ firstName }) => firstName);

    const result = await resultFunc(
      { firstName: 'John', id: 1 },
      {},
      context,
      {}
    );
    expect(result).toEqual(null);
  });

  it("won't return a field with a different user", async () => {
    const context = {
      dataSources: { Auth: { getCurrentPerson: () => ({ id: 9 }) } },
    };
    const resultFunc = enforceCurrentUser(({ firstName }) => firstName);

    const result = await resultFunc(
      { firstName: 'John', id: 1 },
      {},
      context,
      {}
    );
    expect(result).toEqual(null);
  });

  it("won't swallow non-auth errors", async () => {
    const context = {
      dataSources: { Auth: { getCurrentPerson: () => ({ id: 9 }) } },
    };
    const resultFunc = enforceCurrentUser(({ firstName }) => firstName);

    const result = await resultFunc(
      { firstName: 'John', id: 1 },
      {},
      context,
      {}
    );
    expect(result).toEqual(null);
  });

  it("won't swallow non-auth errors", () => {
    const context = {
      dataSources: {
        Auth: { getCurrentPerson: () => throw new Error('Random Error') },
      },
    };
    const resultFunc = enforceCurrentUser(({ firstName }) => firstName);

    const result = resultFunc({ firstName: 'John', id: 1 }, {}, context, {});
    expect(result).rejects.toThrowErrorMatchingSnapshot();
  });
});
