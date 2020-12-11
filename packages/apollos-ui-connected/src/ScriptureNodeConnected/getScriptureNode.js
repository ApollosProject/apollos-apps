import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

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
