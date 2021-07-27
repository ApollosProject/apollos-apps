import { gql } from '@apollo/client';

export default gql`
  mutation likeComment($commentId: ID!) {
    likeComment(commentId: $commentId) {
      id
      isLiked
    }
  }
`;
