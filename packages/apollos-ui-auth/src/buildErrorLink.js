import { onError } from '@apollo/client/link/error';
import AsyncStorage from '@react-native-community/async-storage';

export default (onAuthError) =>
  onError(({ graphQLErrors }) => {
    if (graphQLErrors)
      graphQLErrors.map(async ({ extensions: { code } }) => {
        // wipe out all data and go somewhere
        if (code === 'UNAUTHENTICATED') {
          await AsyncStorage.removeItem('authToken');
          onAuthError();
        }
      });
  });
