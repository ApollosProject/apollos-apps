import gql from 'graphql-tag';

import { contentItemFragment } from 'apolloschurchapp/src/content-single/getContentItem';
import { contentCardFragment } from 'apolloschurchapp/src/ui/ConnectedContentCard';

export default gql`
  query getUserFeed {
    userFeed {
      edges {
        node {
          ...contentItemFragment
          ...contentCardFragment
        }
      }
    }
  }
  ${contentItemFragment}
  ${contentCardFragment}
`;
