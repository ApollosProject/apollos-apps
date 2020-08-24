import gql from 'graphql-tag';
import { interfacesSchema } from '@apollosproject/data-schema';

export default gql`
  extend type Query {
    node(id: ID!): Node
  }

  interface Node {
    id: ID!
  }

  ${interfacesSchema}
`;
