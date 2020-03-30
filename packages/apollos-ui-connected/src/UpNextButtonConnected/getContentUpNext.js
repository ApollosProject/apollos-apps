import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

export default gql`
  query getContentUpNext($nodeId: ID!) {
    node(id: $nodeId) {
      ...ContentUpNextFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_UP_NEXT_FRAGMENT}
`;
