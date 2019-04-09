import gql from 'graphql-tag';

// When querying for isLoggedIn before the app is finished mounting
// isLoggedIn will flip from false to true, before the cache is loaded.
// Using the below query, you can protect from that "flipping" by only
// taking action once the cache has been loaded (cacheLoaded == true)

export default gql`
  query getLoginWithCacheLoaded {
    isLoggedIn @client
    cacheLoaded @client
  }
`;
