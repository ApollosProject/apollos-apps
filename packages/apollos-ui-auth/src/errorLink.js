import { onError } from 'apollo-link-error';

export default onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path, extensions: { code } }) => {
      console.warn(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      if (code === 'UNAUTHENTICATED') {
        // TODO logout mutation
        // TODO nav to onboarding
      }
    });
  if (networkError) console.warn(`[Network error]: ${networkError}`);
});
