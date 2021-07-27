import { gql } from '@apollo/client';

export default gql`
  mutation flagComment($commentId: ID!) {
    flagComment(commentId: $commentId) {
      id
    }
  }
`;
