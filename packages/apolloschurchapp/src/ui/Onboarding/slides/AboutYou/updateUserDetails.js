import gql from 'graphql-tag';

export default gql`
  mutation updateDetails($gender: GENDER, $birthDate: String) {
    updateProfileFields(
      input: [
        { field: Gender, value: $gender }
        { field: BirthDate, value: $birthDate }
      ]
    ) {
      gender
      birthDate
      id
    }
  }
`;
