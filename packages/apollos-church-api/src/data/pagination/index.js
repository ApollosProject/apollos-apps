import { gql } from 'apollo-server';

export const schema = gql`
  type PaginationInfo {
    startCursor: String
    endCursor: String
  }
`;

export const resolver = {
  PaginationInfo: {
    startCursor: ({ startCursor }) => {
      if (typeof startCursor === 'function') {
        return startCursor();
      }
      return startCursor;
    },
    endCursor: ({ endCursor }) => {
      if (typeof endCursor === 'function') {
        return endCursor();
      }
      return endCursor;
    },
  },
};
