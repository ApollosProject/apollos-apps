import gql from 'graphql-tag';

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
