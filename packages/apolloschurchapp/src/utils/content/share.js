import { Platform, Share } from 'react-native';

const share = ({ title, url }) => {
  Share.share({
    title,
    message: Platform.OS === 'android' ? `${title}\n${url}` : title,
    url,
  });
};

export default share;
