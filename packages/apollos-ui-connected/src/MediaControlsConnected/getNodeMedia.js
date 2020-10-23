import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getNodeMedia($nodeId: ID!) {
    node(id: $nodeId) {
      ... on ContentItem {
        ...contentMediaFragment
      }
      ... on VideoNode {
        ...VideoNodeFragment
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_MEDIA_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.VIDEO_NODE_FRAGMENT}
`;
