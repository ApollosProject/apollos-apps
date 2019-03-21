import gql from 'graphql-tag';

export default gql`
  query getCurrentUserProfile {
    currentUser {
      id
      profile {
        firstName
        lastName
        campus {
          name
        }
        email
        nickName
        photo {
          uri
        }
      }
    }
  }
`;
