import { gql } from '@apollo/client';

export default gql`
  query getUsersFollowing {
    usersFollowing {
      id
      firstName
      lastName
      photo {
        uri
      }
      followingCurrentUser {
        id
        state
      }
      currentUserFollowing {
        id
        state
      }
    }
  }
`;
