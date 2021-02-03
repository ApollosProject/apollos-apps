import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import GET_ROCK_AUTH_DETAILS from './getRockAuthDetails';

export const getRockAuthDetails = async (client) => {
  try {
    const { data: { currentUser: { rock } = {} } = {} } = await client.query({
      query: GET_ROCK_AUTH_DETAILS,
      fetchPolicy: 'network-only',
    });
    return rock;
  } catch (e) {
    console.warn(e);
    return { authCookie: null, authToken: null };
  }
};

const RockAuthedInAppBrowser = {
  open: async (
    baseURL,
    { client, ...options },
    auth = { useRockCookie: false, useRockToken: false }
  ) => {
    try {
      const url = new URL(baseURL);
      // NOTE: RN adds a trailing slash
      // https://github.com/facebook/react-native/issues/24428
      url._url = url.toString().endsWith('/')
        ? url.toString().slice(0, -1)
        : url.toString();

      let headers = {};
      let creds = {};

      // use auth cookie or query param
      if (auth.useRockCookie || auth.useRockToken) {
        creds = await getRockAuthDetails(client);
        if (auth.useRockCookie) headers = { Cookie: creds.authCookie };
        if (auth.useRockToken)
          url.searchParams.append('rckipid', creds.authToken);
      }
      const isValidUrl = ['http', 'https'].includes(
        url.toString().split(':')[0].toLowerCase()
      );
      if (
        !options.externalBrowser &&
        isValidUrl &&
        (await InAppBrowser.isAvailable())
      ) {
        InAppBrowser.open(url.toString(), {
          headers,
          ...options,
        });
      } else Linking.openURL(isValidUrl ? url.toString() : baseURL);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
    }
  },
};

export default RockAuthedInAppBrowser;
