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
  }

  extend type Query {
    people(email: String!): [Person]
  }
`;
