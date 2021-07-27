import { gql } from '@apollo/client';

export default gql`
  mutation acceptFollowRequest($personId: ID!) {
    acceptFollowRequest(requestPersonId: $personId) {
      state
      id
    }
  }
`;
