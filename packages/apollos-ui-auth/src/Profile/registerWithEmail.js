import gql from 'graphql-tag';

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
