import { gql } from '@apollo/client';

export default gql`
  query GetMessage($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ... on ContentNode {
        htmlContent
      }
    }
  }
`;
