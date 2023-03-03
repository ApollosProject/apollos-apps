import { gql } from '@apollo/client';

export default gql`
  query getRequestedFollows {
    followRequests {
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
