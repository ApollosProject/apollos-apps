import gql from 'graphql-tag';

export default gql`
  mutation changePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword) {
      token
    }
  }
`;
