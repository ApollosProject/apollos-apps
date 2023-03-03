import { gql } from '@apollo/client';

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
