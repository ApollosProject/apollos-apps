import { gql } from '@apollo/client';

export default gql`
  mutation verifyPin($phone: String!, $code: String!) {
    authenticateWithSms(phoneNumber: $phone, pin: $code) {
      token
    }
  }
`;
