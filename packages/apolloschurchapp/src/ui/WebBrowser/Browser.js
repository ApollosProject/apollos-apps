import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const Browser = {
  open: async (url, headersAndOptions) => {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, { ...headersAndOptions });
        console.log(result);
      } else Linking.openURL(url);
    } catch (e) {
      console.error(e);
    }
  },
};

export default Browser;
