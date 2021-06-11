import gql from 'graphql-tag';

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
