import { Platform, Share } from 'react-native';
// import { get } from 'lodash';
import { track, events } from 'apolloschurchapp/src/analytics';
// import getSiteLink from './getSiteLink';

const share = ({ title, url, id = '' }) => {
  Share.share({
    title,
    message: Platform.OS === 'android' ? `${title}\n${url}` : title,
    url,
  });

  track({
    eventName: events.ShareContent,
    properties: { title, id },
  });
};

export default share;
