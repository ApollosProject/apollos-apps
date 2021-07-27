import { gql } from '@apollo/client';

export default gql`
  query userExists($identity: String!) {
    userExists(identity: $identity)
  }
`;
