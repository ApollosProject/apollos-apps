/* eslint-disable import/prefer-default-export */
import { AuthenticationError } from 'apollo-server';

export const resolver = {
  Mutation: {
    authenticationError: () =>
      throw new AuthenticationError('Must authenticate'),
  },
};
