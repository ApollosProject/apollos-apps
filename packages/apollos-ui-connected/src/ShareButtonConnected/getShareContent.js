import gql from 'graphql-tag';

export default gql`
  query getShareContent($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ... on SharableNode {
        sharing {
          url
          message
          title
        }
      }
    }
  }
`;
