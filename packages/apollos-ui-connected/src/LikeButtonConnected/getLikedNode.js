import gql from 'graphql-tag';

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
