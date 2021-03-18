import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

export default gql`
  query getContentNode($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ...ContentNodeFragment
      # TODO: ContentSingleFragment deprecated
      ...ContentSingleFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_NODE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.CONTENT_SINGLE_FRAGMENT}
`;
