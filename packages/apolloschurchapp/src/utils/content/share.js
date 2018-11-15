import { Platform, Share } from 'react-native';
// import { get } from 'lodash';
import { track, events } from 'apolloschurchapp/src/analytics';
// import getSiteLink from './getSiteLink';

const share = ({ title, url, id = '' }) => {
  let formattedMessage = title;
  if (Platform.OS === 'android') formattedMessage = `${title} ${url}`;
  Share.share({
    title,
    message: formattedMessage,
    url,
  });

  track({
    eventName: events.ShareContent,
    properties: { title, id },
  });
};

export default share;
