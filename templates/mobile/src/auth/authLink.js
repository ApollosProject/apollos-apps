import AsyncStorage from '@react-native-community/async-storage';
import { setContext } from '@apollo/client/link/context';

export default setContext(async (request, { headers }) => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) {
      return {};
    }

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${accessToken}`,
      },
    };
  } catch (err) {
    console.warn('Authorization Failed', err);
    return {};
  }
});
