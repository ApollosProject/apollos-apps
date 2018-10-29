import gql from 'graphql-tag';

import { contentCardFragment } from 'apolloschurchapp/src/ui/ConnectedContentCard';
import { contentItemFragment } from 'apolloschurchapp/src/content-single/getContentItem';

export default gql`
  query getAllLikedContent {
    getAllLikedContent {
      ... on ContentItem {
        ...contentItemFragment
        ...contentCardFragment
      }
    }
  }
  ${contentItemFragment}
  ${contentCardFragment}
`;
