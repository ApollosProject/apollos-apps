import gql from 'graphql-tag';

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
