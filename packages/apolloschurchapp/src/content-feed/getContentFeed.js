import gql from 'graphql-tag';

import { contentCardFragment } from 'apolloschurchapp/src/ui/ConnectedContentCard';
import { contentItemFragment } from '../content-single/getContentItem';

export default gql`
  query getContentFeed($itemId: ID!) {
    node(id: $itemId) {
      ... on ContentChannel {
        childContentItemsConnection {
          edges {
            node {
              ...contentItemFragment
              ...contentCardFragment
            }
          }
        }
      }
    }
  }
  ${contentItemFragment}
  ${contentCardFragment}
`;
