import ApollosConfig from '@apollosproject/config';

import gql from 'graphql-tag';

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
