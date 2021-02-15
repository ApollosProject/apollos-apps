import gql from 'graphql-tag';

export default gql`
  query getShareContent($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ... on ContentItem {
        sharing {
          url
          message
          title
        }
      }
      ... on ShareableNode {
        sharing {
          url
          message
          title
        }
      }
      ... on TextFeature {
        sharing {
          title
          message
        }
      }
      ... on ScriptureFeature {
        sharing {
          title
          message
        }
      }
    }
  }
`;
