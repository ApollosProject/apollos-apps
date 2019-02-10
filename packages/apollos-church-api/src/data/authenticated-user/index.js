import gql from 'graphql-tag';

export const schema = gql`
  extend type AuthenticatedUser {
    rockToken: String
  }
`;

export const resolver = {
  AuthenticatedUser: {
    rockToken: (root, args, context) => context.rockCookie,
  },
};
