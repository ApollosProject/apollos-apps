import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import gql from 'graphql-tag';
import { client } from '../../client';

export const GET_USER_COOKIE = gql`
  query CurrentUserCookie {
    currentUser {
      id
      rockToken
    }
  }
`;

export const getCookie = async () => {
  const { data: { currentUser: { rockToken } = {} } = {} } = await client.query(
    {
      query: GET_USER_COOKIE,
    }
  );
  return rockToken;
};

const Browser = {
  open: async (url, headersAndOptions) => {
    const cookie = await getCookie();
    console.log('cookie', cookie);
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          Cookie: cookie,
          ...headersAndOptions,
        });
        console.log(result);
      } else Linking.openURL(url);
    } catch (e) {
      console.error(e);
    }
  },
};

export default Browser;
