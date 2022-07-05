import { gql } from '@apollo/client';

export default gql`
  query getUserFirstName {
    currentUser {
      id
      profile {
        id
        firstName
        lastName
      }
    }
  }
`;
