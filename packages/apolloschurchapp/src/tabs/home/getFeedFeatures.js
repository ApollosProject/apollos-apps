import gql from 'graphql-tag';

import { CONTENT_ITEM_FRAGMENT } from 'apolloschurchapp/src/content-single/getContentItem';
import { LARGE_CARD_FRAGMENT } from 'apolloschurchapp/src/ui/ContentCardConnected';

export default gql`
  query getFeedFeatures {
    userFeedFeatures {
      ... on ActionListFeature {
        id
        title
        subtitle
        actions {
          id
          title
          subtitle
          image {
            sources {
              uri
            }
          }
          relatedNode {
            id
          }
        }
      }
    }
  }
  ${CONTENT_ITEM_FRAGMENT}
  ${LARGE_CARD_FRAGMENT}
`;
