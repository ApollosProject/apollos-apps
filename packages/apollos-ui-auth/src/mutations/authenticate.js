import { gql } from '@apollo/client';

export default gql`
  mutation authenticate($email: String!, $password: String!) {
    authenticate(identity: $email, password: $password) {
      token
    }
  }
`;
