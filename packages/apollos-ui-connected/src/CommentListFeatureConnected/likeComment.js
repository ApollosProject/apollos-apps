import gql from 'graphql-tag';

export default gql`
  mutation likeComment($commentId: ID!) {
    likeComment(commentId: $commentId) {
      id
      isLiked
    }
  }
`;
