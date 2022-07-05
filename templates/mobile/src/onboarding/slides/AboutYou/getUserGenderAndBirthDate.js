import { gql } from '@apollo/client';

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
