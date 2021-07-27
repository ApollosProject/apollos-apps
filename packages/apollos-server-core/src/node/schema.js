import { gql } from '@apollo/client';

export default gql`
  extend type Query {
    node(id: ID!): Node
  }

  interface Node {
    id: ID!
  }
`;
