import gql from 'graphql-tag';

export default gql`
  query getContentNodeTitle($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ... on ContentNode {
        title
      }
    }
  }
`;
