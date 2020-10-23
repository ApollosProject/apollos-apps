import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

// TODO this query is deprecated, use getNodeMedia
export default gql`
  query getContentMedia($contentId: ID!) {
    node(id: $contentId) {
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
