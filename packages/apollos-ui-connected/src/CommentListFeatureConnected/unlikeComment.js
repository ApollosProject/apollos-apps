import gql from 'graphql-tag';

export default gql`
  mutation unlikeComment($commentId: ID!) {
    unlikeComment(commentId: $commentId) {
      id
      isLiked
    }
  }
`;
