import gql from 'graphql-tag';

import { contentItemFragment } from 'apolloschurchapp/src/content-single/getContentItem';
import { tileCardFragment } from 'apolloschurchapp/src/ui/ContentCardConnected';

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
  ${contentItemFragment}
  ${tileCardFragment}
`;
