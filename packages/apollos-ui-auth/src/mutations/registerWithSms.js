import gql from 'graphql-tag';

export default gql`
  mutation registerWithSms(
    $identity: String!
    $password: String!
    $userProfile: [UpdateProfileInput]
  ) {
    registerWithSms(
      phoneNumber: $identity
      pin: $password
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
