import React, { PureComponent } from 'react';
import PropType from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import Touchable from 'apolloschurchapp/src/ui/Touchable';
import TableView, {
  Cell,
  CellIcon,
  CellText,
  Divider,
} from 'apolloschurchapp/src/ui/TableView';

import getLiveStream from 'apolloschurchapp/src/live/getLiveStream';
import changeLivestream from './changeLivestream';

const TouchableCell = ({ iconName, cellText, handlePress }) => (
  <Touchable onPress={handlePress}>
    <Cell>
      <CellIcon name={iconName} />
      <CellText>{cellText}</CellText>
    </Cell>
  </Touchable>
);

TouchableCell.propTypes = {
  iconName: PropType.string.isRequired,
  cellText: PropType.string.isRequired,
  handlePress: PropType.func.isRequired,
};

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
