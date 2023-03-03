import { gql } from '@apollo/client';

export default gql`
  query CurrentUserPhoto {
    currentUser {
      id
      profile {
        firstName
        lastName
        id
        photo {
          uri
        }
      }
    }
  }
`;
