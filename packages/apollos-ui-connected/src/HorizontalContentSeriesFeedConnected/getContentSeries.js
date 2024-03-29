import { gql } from '@apollo/client';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getContentSeries($itemId: ID!, $cursor: String) {
    node(id: $itemId) {
      ... on ContentItem {
        id
        childContentItemsConnection(after: $cursor) {
          edges {
            cursor
            node {
              ...contentCardFragment
            }
          }
        }
        siblingContentItemsConnection(after: $cursor) {
          edges {
            cursor
            node {
              ...contentCardFragment
            }
          }
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;
