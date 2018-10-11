import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import TableView, { Divider } from 'apolloschurchapp/src/ui/TableView';

import getLiveStream from 'apolloschurchapp/src/live/getLiveStream';
import TouchableCell from './TouchableCell';
import changeLivestream from './changeLivestream';

const ChangeLivestream = () => (
  <Query query={getLiveStream}>
    {({ data }) => {
      const isLive = get(data, 'liveStream.isLive', false);
      return (
        <TouchableCell
          handlePress={() => changeLivestream({ isLive: !isLive })}
          iconName={isLive ? 'pause' : 'play'}
          cellText={`${isLive ? 'End' : 'Start'} The Livestream`}
        />
      );
    }}
  </Query>
);

export default class TestingControlPanel extends PureComponent {
  static navigationOptions = () => ({
    title: 'Testing Control Panel',
  });

  render() {
    return (
      <TableView>
        <ChangeLivestream />
        <Divider />
      </TableView>
    );
  }
}
