import gql from 'graphql-tag';

export default gql`
  query getCurrentPersonProfile {
    currentUser {
      id
      profile {
        id
        photo {
          uri
        }
      }
    }
  }
`;
