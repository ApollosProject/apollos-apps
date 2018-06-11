import { gql } from 'apollo-server';

export default gql`
  type Person implements Node {
    id: ID!
    firstName: String!
    lastName: String!
    nickName: String
    birthDate: String
    birthDay: Int
    birthMonth: Int
    birthYear: Int
    email: String
  }
`;
