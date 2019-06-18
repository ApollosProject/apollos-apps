import gql from 'graphql-tag';

import { CONTENT_ITEM_FRAGMENT } from 'apolloschurchapp/src/content-single/getContentItem';
import { TILE_CARD_FRAGMENT } from 'apolloschurchapp/src/ui/ContentCardConnected';

export default gql`
  query getContentChannels {
    contentChannels {
      id
      name
      childContentItemsConnection(first: 3) {
        edges {
          node {
            id
            ...contentItemFragment
            ...tileCardFragment
          }
        }
      }
    }
  }
  ${CONTENT_ITEM_FRAGMENT}
  ${TILE_CARD_FRAGMENT}
`;
