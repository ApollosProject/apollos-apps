import { client } from 'apolloschurchapp/src/client';
import getLiveStream from 'apolloschurchapp/src/live/getLiveStream';

const changeLivestream = ({ isLive }) =>
  client.writeQuery({
    query: getLiveStream,
    data: {
      liveStream: {
        __typename: 'LiveStream',
        isLive,
      },
    },
  });

export default changeLivestream;
