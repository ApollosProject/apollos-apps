import gql from 'graphql-tag';

export default gql`
  mutation updateDetails($input: [UpdateProfileInput]!) {
    updateProfileFields(input: $input) {
      gender
      birthDate
      id
    }
  }
`;
