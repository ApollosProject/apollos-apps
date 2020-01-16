import gql from 'graphql-tag';

export default gql`
  query userExists($identity: String!) {
    userExists(identity: $identity)
  }
`;
