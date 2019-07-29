import { onError } from 'apollo-link-error';

export default (cache, defaults) =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(
        ({ message, locations, path, extensions: { code } }) => {
          console.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
          // wipe out all data and go to beginning of app
          if (code === 'UNAUTHENTICATED') {
            // cache.writeData({ data: defaults });
            // TODO nav to onboarding
          }
          return null;
        }
      );
    if (networkError) console.warn(`[Network error]: ${networkError}`);
  });
