import gql from 'graphql-tag';

export default gql`
  query getUserGenderAndBirthDate {
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
