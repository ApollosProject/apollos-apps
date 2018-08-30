import { gql } from 'apollo-server';

export default gql`
  type Person implements Node {
    id: ID!
    firstName: String!
    lastName: String!
    nickName: String
    email: String
    photo: ImageMediaSource
  }

  extend type Mutation {
    updateProfile(input: UpdateProfileInput!): Person
    uploadProfileImage(file: Upload!, size: Int!): Person
  }

  extend type Query {
    people(email: String!): [Person]
  }
`;
