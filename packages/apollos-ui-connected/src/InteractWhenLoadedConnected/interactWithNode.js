import gql from 'graphql-tag';

export default gql`
  mutation interactWithNode($nodeId: ID!, $action: InteractionAction!) {
    interactWithNode(nodeId: $nodeId, action: $action) {
      success
    }
  }
`;
