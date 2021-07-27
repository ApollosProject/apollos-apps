import { gql } from '@apollo/client';

export default gql`
  mutation unlikeComment($commentId: ID!) {
    unlikeComment(commentId: $commentId) {
      id
      isLiked
    }
  }
`;
