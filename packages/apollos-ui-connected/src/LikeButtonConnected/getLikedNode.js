import gql from 'graphql-tag';

export default gql`
  query getLikedNode($nodeId: ID!) {
    node(id: $nodeId) {
      ... on ContentItem {
        id
        isLiked
      }
      ... on LikableNode {
        id
        isLiked
      }
    }
  }
`;
