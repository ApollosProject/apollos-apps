import { gql } from '@apollo/client';

export default gql`
  query getCurrentPersonProfile {
    currentUser {
      id
      profile {
        id
        firstName
        lastName
        photo {
          uri
        }
      }
    }
  }
`;
