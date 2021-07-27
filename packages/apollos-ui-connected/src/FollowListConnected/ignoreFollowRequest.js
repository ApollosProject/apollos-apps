import { gql } from '@apollo/client';

export default gql`
  mutation ignoreFollowRequest($personId: ID!) {
    ignoreFollowRequest(requestPersonId: $personId) {
      state
      id
    }
  }
`;
