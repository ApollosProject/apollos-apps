import gql from 'graphql-tag';

import { largeCardFragment } from 'apolloschurchapp/src/ui/ContentCardConnected';
import { contentItemFragment } from 'apolloschurchapp/src/content-single/getContentItem';

export default gql`
  query getAllLikedContent($first: Int, $after: String) {
    likedContent(first: $first, after: $after) {
      pageInfo {
        endCursor
      }
      edges {
        node {
          ... on ContentItem {
            ...contentItemFragment
            ...largeCardFragment
          }
        }
      }
    }
  }
  ${contentItemFragment}
  ${largeCardFragment}
`;
