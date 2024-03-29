import { gql } from '@apollo/client';

export default gql`
  query getSearchPeople($name: String) {
    searchPeople(name: $name) {
      edges {
        node {
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
    }
  }
`;
