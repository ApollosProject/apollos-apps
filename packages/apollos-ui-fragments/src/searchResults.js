import { gql } from '@apollo/client';

const SEARCH_RESULT_FRAGMENT = gql`
  fragment SearchResultFragment on SearchResult {
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
        __typename
      }
    }
  }
`;

export { SEARCH_RESULT_FRAGMENT };
