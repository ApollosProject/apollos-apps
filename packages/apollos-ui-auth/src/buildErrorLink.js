import { onError } from 'apollo-link-error';

export default (onAuthError) =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ extensions: { code } }) => {
        // wipe out all data and go somewhere
        if (code === 'UNAUTHENTICATED') {
          onAuthError();
        }
        return null;
      });

    if (networkError) return null;
    return null;
  });
