import { AuthenticationError, gql } from 'apollo-server';
import { createGlobalId } from '../node';

export { default as model } from './model';

export const schema = gql`
  type AuthenticatedUser {
    id: ID!
    profile: Person
  }

  type Authentication {
    user: AuthenticatedUser
    token: String
  }
`;

export const resolver = {
  Query: {
    currentUser: (root, args, { user }) => {
      if (user) return user;
      throw new AuthenticationError();
    },
  },
  AuthenticatedUser: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    profile: (authUser) => authUser,
  },
  Authentication: {
    user: (root, args, { models }) => models.Auth.getCurrentPerson(),
  },
  Mutation: {
    authenticate: (root, { identity, password }, { models }) =>
      models.Auth.authenticate({ identity, password }),
  },
};
