import { gql } from '@apollo/client';

export default gql`
  mutation updateLikeNode($nodeId: ID!, $operation: LIKE_OPERATION!) {
    updateLikeNode(input: { nodeId: $nodeId, operation: $operation }) {
      id
      ... on LikableNode {
        isLiked
        likedCount
      }
      ... on ContentItem {
        isLiked
        likedCount
      }
    }
  }
`;
