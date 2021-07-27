import { gql } from '@apollo/client';

export default gql`
  mutation requestFollow($personId: ID!) {
    requestFollow(followedPersonId: $personId) {
      state
      id
    }
  }
`;
