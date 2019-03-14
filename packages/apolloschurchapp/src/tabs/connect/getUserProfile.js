import gql from 'graphql-tag';

export default gql`
  query {
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
