import { gql } from '@apollo/client';

export default gql`
  mutation interactWithNode(
    $nodeId: ID!
    $action: InteractionAction!
    $data: [InteractionDataField]
  ) {
    interactWithNode(nodeId: $nodeId, action: $action, data: $data) {
      success
    }
  }
`;
