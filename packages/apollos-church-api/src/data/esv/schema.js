import { gql } from 'apollo-server';

export default gql`
  type ESVScripture {
    html: String
  }

  extend type Query {
    scripture(query: String!): ESVScripture
  }
`;
