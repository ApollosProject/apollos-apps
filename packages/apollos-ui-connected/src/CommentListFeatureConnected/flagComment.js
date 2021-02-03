import gql from 'graphql-tag';

export default gql`
  mutation flagComment($commentId: ID!) {
    flagComment(commentId: $commentId) {
      id
    }
  }
`;
