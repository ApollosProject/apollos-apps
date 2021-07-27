import { gql } from '@apollo/client';

export default gql`
  mutation deleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;
