import gql from 'graphql-tag';

export default gql`
  mutation updateLikeEntity($nodeId: ID!, $operation: LIKE_OPERATION!) {
    updateLikeEntity(input: { nodeId: $nodeId, operation: $operation }) {
      id
      isLiked
      likedCount
    }
  }
`;
