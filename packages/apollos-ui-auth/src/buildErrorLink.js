import { onError } from 'apollo-link-error';

export default (restore, navigate) =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(
        ({ message, locations, path, extensions: { code } }) => {
          console.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
          // wipe out all data and go to beginning of app
          if (code === 'UNAUTHENTICATED') {
            restore();
            navigate();
          }
          return null;
        }
      );
    if (networkError) console.warn(`[Network error]: ${networkError}`);
  });
