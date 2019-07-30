import { Platform, Share } from 'react-native';

const share = ({ title, url, message }) => {
  Share.share({
    title,
    message:
      Platform.OS === 'android'
        ? `${message || title}\n${url}`
        : message || title,
    url,
  });
};

export default share;
