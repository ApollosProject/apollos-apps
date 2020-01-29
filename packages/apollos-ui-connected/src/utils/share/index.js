import { Platform, Share } from 'react-native';

const share = ({ title, url, message }) => {
  Share.share({
    title,
    message:
      // url isn't used on Android so we want to include that in the message if available
      Platform.OS === 'android'
        ? [message, url].filter((s) => !!s).join('\n')
        : message,
    url,
  });
};

export default share;
