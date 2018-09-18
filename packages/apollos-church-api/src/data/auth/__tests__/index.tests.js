import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import { makeExecutableSchema } from 'apollo-server';

import { testSchema as typeDefs, resolvers } from 'apollos-church-api/src/data';
import { getTestContext } from 'apollos-church-api/src/utils/testUtils';
import { generateToken, registerToken } from '../token';

// we import the root-level schema and resolver so we test the entire integration:

describe('Auth', () => {
  let schema;
  let context;
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockRockDataSourceAPI();
    schema = makeExecutableSchema({ typeDefs, resolvers });
    context = getTestContext();
  });

  it('logs in a user', async () => {
    const query = `
      mutation {
        authenticate(identity: "some-identity", password: "good") {
          user {
            id
            profile {
              id
            }
          }
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('throws invalid credentials error on bad password', async () => {
    const query = `
      mutation {
        authenticate(identity: "some-identity", password: "bad") {
          user {
            id
          }
        }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  describe('currentUser query', () => {
    const query = `
      query {
        currentUser {
          id
          profile {
            id
          }
        }
      }
    `;
    it('requires you to be logged in', async () => {
      const rootValue = {};

      const result = await graphql(schema, query, rootValue, context);
      expect(result).toMatchSnapshot();
    });

    it('queries current user when logged in', async () => {
      const rootValue = {};
      const { userToken, rockCookie } = registerToken(
        generateToken({ cookie: 'some-cookie' })
      );
      context.userToken = userToken;
      context.rockCookie = rockCookie;

      const result = await graphql(schema, query, rootValue, context);
      expect(result).toMatchSnapshot();
    });

    it('queries current user when logged in', async () => {
      const rootValue = {};
      try {
        const { userToken, rockCookie } = registerToken('asdfasdfasdf');
        context.userToken = userToken;
        context.rockCookie = rockCookie;

        await graphql(schema, query, rootValue, context);
      } catch (e) {
        expect(e.message).toEqual('Invalid token');
      }
    });
  });

  it('registers an auth token and passes the cookie on requests to rock', async () => {
    const token = generateToken({ cookie: 'some-cookie' });
    const secondContext = getTestContext({
      req: {
        headers: { authorization: token },
      },
    });
    const query = `
      query {
        currentUser {
          id
        }
      }
    `;
    const rootValue = {};
    await graphql(schema, query, rootValue, secondContext);
    expect(fetch.mock.calls[0][0].headers).toMatchSnapshot();
  });

  describe('User Registration', () => {
    it('checks if user is already registered', async () => {
      const result = await context.dataSources.Auth.personExists({
        identity: 'isaac.hardy@newspring.cc',
      });

      expect(result).toEqual(true);
    });

    it('throws error in personExists', async () => {
      const result = await context.dataSources.Auth.personExists({
        identity: 'fake',
      });

      expect(result).toEqual(false);
    });

    it('creates user profile', async () => {
      const result = await context.dataSources.Auth.createUserProfile({
        email: 'isaac.hardy@newspring.cc',
      });

      expect(result).toEqual({ personId: 35 });
    });

    it('throws error in createUserProfile', async () => {
      try {
        await context.dataSources.Auth.createUserProfile({
          email: '',
        });
      } catch (e) {
        expect(e.message).toEqual('Unable to create profile!');
      }
    });

    it('creates user login', async () => {
      const result = await context.dataSources.Auth.createUserLogin({
        email: 'isaac.hardy@newspring.cc',
        password: 'password',
        personId: 35,
      });

      expect(result).toEqual({ id: 21 });
    });

    it('throws error in createUserLogin', async () => {
      try {
        await context.dataSources.Auth.createUserLogin({
          email: '',
          password: 'password',
          personId: 35,
        });
      } catch (e) {
        expect(e.message).toEqual('Unable to create user login!');
      }
    });

    it('creates new registration', async () => {
      const query = `
        mutation {
          registerPerson(email: "hello.world@earth.org", password: "good") {
            user {
              id
              profile {
                id
                email
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
});
