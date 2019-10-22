import gql from 'graphql-tag';
import { CONTENT_ITEM_FRAGMENT } from 'apolloschurchapp/src/content-single/getContentItem';
import { LARGE_CARD_FRAGMENT } from 'apolloschurchapp/src/ui/ContentCardConnected';

export default gql`
  query searchResults($searchText: String!) {
    search(query: $searchText) {
      edges {
        title
        summary
        coverImage {
          name
          sources {
            uri
          }
        }
        cursor
        node {
          ... on ContentItem {
            id
            ...contentItemFragment
            ...largeCardFragment
          }
        }
      }
    }
  }
  ${CONTENT_ITEM_FRAGMENT}
  ${LARGE_CARD_FRAGMENT}
`;
