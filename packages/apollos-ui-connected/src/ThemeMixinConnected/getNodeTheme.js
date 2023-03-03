import { gql } from '@apollo/client';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getNodeTheme($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ...ThemedNodeFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.THEMED_NODE_FRAGMENT}
`;
