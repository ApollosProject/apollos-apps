import ApollosConfig from '@apollosproject/config';
import { gql } from '@apollo/client';

export default gql`
  query getContentNode($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ...ContentNodeFragment
      ...ContentSingleFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_NODE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.CONTENT_SINGLE_FRAGMENT}
`;
