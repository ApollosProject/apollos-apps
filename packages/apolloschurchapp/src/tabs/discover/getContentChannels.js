import gql from 'graphql-tag';

import { contentCardFragment } from 'apolloschurchapp/src/ui/ConnectedContentCard';
import { contentItemFragment } from 'apolloschurchapp/src/content-single/getContentItem';

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
            ...contentCardFragment
          }
        }
      }
    }
  }
  ${contentItemFragment}
  ${contentCardFragment}
`;
