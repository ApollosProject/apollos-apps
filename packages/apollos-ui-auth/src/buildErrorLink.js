import { onError } from 'apollo-link-error';

export default (restore, navigate) =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ extensions: { code } }) => {
        // wipe out all data and go somewhere
        if (code === 'UNAUTHENTICATED') {
          restore();
          navigate();
          // TODO: re-auth
          // modify the operation context with a new token
          // const oldHeaders = operation.getContext().headers;
          // operation.setContext({
          // headers: {
          // ...oldHeaders,
          // authorization: getNewToken(),
          // },
          // });
          // // retry the request, returning the new observable
          // return forward(operation);
        }
        return null;
      });

    if (networkError) return null;
    // TODO: retry
    // if you would also like to retry automatically on
    // network errors, we recommend that you use
    // apollo-link-retry
    return null;
  });
