import { gql } from '@apollo/client';

export default gql`
  query getSuggestedFollows {
    suggestedFollows {
      id
      firstName
      lastName
      photo {
        uri
      }
      currentUserFollowing {
        id
        state
      }
    }
  }
`;
