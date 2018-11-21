import gql from 'graphql-tag';

import { largeCardFragment } from 'apolloschurchapp/src/ui/ContentCardConnected';
import { contentItemFragment } from 'apolloschurchapp/src/content-single/getContentItem';

export default gql`
  query getAllLikedContent {
    getAllLikedContent {
      ... on ContentItem {
        ...contentItemFragment
        ...largeCardFragment
      }
    }
  }
  ${contentItemFragment}
  ${largeCardFragment}
`;
