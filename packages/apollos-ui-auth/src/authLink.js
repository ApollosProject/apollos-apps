import AsyncStorage from '@react-native-community/async-storage';
import { setContext } from '@apollo/client/link/context';

export default setContext(async (request, { headers }) => {
  try {
    const authToken = await AsyncStorage.getItem('authToken');
    if (!authToken) return {};

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: authToken,
      },
    };
  } catch (err) {
    // eslint-disable-next-line
    console.warn('Authorization Failed', err);
    return {};
  }
});
