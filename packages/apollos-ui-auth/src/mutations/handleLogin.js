import { gql } from '@apollo/client';

export default gql`
  mutation handleLogin($authToken: String!) {
    handleLogin(authToken: $authToken) @client
  }
`;
