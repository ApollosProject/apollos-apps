import { gql } from '@apollo/client';

export default gql`
  mutation updateDetails($input: [UpdateProfileInput]!) {
    updateProfileFields(input: $input) {
      gender
      birthDate
      id
    }
  }
`;
