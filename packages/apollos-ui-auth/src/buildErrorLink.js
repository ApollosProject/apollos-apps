import { onError } from '@apollo/client/link/error';
import AsyncStorage from '@react-native-community/async-storage';

export default (onAuthError) =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ extensions: { code } }) => {
        // wipe out all data and go somewhere
        if (code === 'UNAUTHENTICATED') {
          AsyncStorage.removeItem('authToken');
          onAuthError();
        }
        return null;
      });

    if (networkError) return null;
    return null;
  });
