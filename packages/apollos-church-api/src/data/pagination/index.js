import { gql } from 'apollo-server';

export const schema = gql`
  type PaginationInfo {
    startCursor: String
    endCursor: String
  }
`;

export const resolver = {
  PaginationInfo: {
    startCursor: async ({ edges }) => {
      const result = await edges;
      return result.length ? result[0].cursor : null;
    },
    endCursor: async ({ edges }) => {
      const result = await edges;
      return result.length ? result[result.length - 1].cursor : null;
    },
  },
};
