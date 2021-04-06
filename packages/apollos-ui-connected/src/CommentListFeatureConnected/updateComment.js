import { gql } from '@apollo/client';

export default gql`
  mutation updateComment(
    $text: String
    $commentId: ID!
    $visibility: CommentVisibility
  ) {
    updateComment(text: $text, commentId: $commentId, visibility: $visibility) {
      id
      text
    }
  }
`;
