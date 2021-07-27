import ApollosConfig from '@apollosproject/config';
import { gql } from '@apollo/client';

export default gql`
  query getContentNode($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ...ScriptureNodeFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.SCRIPTURE_NODE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.SCRIPTURE_FRAGMENT}
`;
