import ApollosConfig from '@apollosproject/config';

import { gql } from '@apollo/client';

export default gql`
  query searchResults($searchText: String!) {
    search(query: $searchText) {
      edges {
        ...SearchResultFragment
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.SEARCH_RESULT_FRAGMENT}
`;
