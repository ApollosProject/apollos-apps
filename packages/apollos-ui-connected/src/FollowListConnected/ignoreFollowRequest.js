import gql from 'graphql-tag';

export default gql`
  mutation ignoreFollowRequest($personId: ID!) {
    ignoreFollowRequest(requestPersonId: $personId) {
      state
      id
    }
  }
`;
