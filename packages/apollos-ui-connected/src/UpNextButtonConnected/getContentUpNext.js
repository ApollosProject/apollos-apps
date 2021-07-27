import ApollosConfig from '@apollosproject/config';
import { gql } from '@apollo/client';

export default gql`
  query getContentUpNext($nodeId: ID!) {
    node(id: $nodeId) {
      ...ContentUpNextFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_UP_NEXT_FRAGMENT}
`;
