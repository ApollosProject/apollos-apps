import gql from 'graphql-tag';

export default gql`
  mutation createInteraction($itemId: ID!, $sessionId: ID!) {
    createInteraction(
      input: { nodeId: $itemId, sessionId: $sessionId, operation: Like }
    ) {
      id
      operation
      interactionDateTime
    }
  }
`;
