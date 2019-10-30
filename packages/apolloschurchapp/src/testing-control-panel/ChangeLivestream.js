import React from 'react';

// import { Query } from 'react-apollo';
// import { get } from 'lodash';

// import { client } from 'apolloschurchapp/src/client';
import TouchableCell from './TouchableCell';

// const changeLivestream = ({ isLive }) =>
//   client.writeQuery({
//     query: GET_LIVE_STREAM,
//     data: {
//       liveStream: {
//         __typename: 'LiveStream',
//         isLive,
//       },
//     },
//   });

// **********************************************************************************************************
// Currently disabled while we reconfigure this component to work with new ContentItem/LiveStream integration
// **********************************************************************************************************

const ChangeLivestream = () => (
  // <Query query={GET_LIVE_STREAM}>
  //   {({ data }) => {
  //     const isLive = get(data, 'liveStream.isLive', false);
  //     return (
  <TouchableCell
    handlePress={() => console.warn('Functionality currently not enabled')}
    iconName={false ? 'pause' : 'play'}
    cellText={`${false ? 'End' : 'Start'} The Livestream`}
  />
  //     );
  //   }}
  // </Query>
);

export default ChangeLivestream;
