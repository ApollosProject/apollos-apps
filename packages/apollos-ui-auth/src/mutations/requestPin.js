import { gql } from '@apollo/client';

export default gql`
  mutation requestPin($phone: String!) {
    requestSmsLoginPin(phoneNumber: $phone) {
      success
    }
  }
`;
