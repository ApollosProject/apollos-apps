import { gql } from 'apollo-server';

export default gql`
  type ESVScripture {
    query: String
    html: String
  }
`;
