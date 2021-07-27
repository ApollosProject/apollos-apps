import { gql } from '@apollo/client';

export default gql`
  mutation register(
    $identity: String!
    $password: String!
    $userProfile: [UpdateProfileInput]
  ) {
    registerPerson(
      email: $identity
      password: $password
      userProfile: $userProfile
    ) {
      token
      user {
        id
        profile {
          id
          firstName
          lastName
        }
      }
    }
  }
`;
