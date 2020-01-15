import gql from 'graphql-tag';

export default gql`
  mutation requestPin($phone: String!) {
    requestSmsLoginPin(phoneNumber: $phone) {
      success
    }
  }
`;
