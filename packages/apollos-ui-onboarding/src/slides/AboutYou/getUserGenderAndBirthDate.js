import gql from 'graphql-tag';

export default gql`
  query getUserFirstName {
    currentUser {
      id
      profile {
        id
        gender
        birthDate
      }
    }
  }
`;
