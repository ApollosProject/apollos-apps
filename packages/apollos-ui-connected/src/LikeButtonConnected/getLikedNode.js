import { gql } from '@apollo/client';

export default gql`
  query getLikedNode($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ... on ContentItem {
        isLiked
      }
      ... on LikableNode {
        isLiked
      }
    }
  }
`;
