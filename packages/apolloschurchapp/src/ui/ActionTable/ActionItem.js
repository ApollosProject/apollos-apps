import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

import {
  Cell,
  ChannelLabel,
  H4,
  CellContent,
  styled,
  Divider,
  TouchableScale,
} from '@apollosproject/ui-kit';

const CellImage = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 4,
  height: theme.sizing.baseUnit * 4,
  borderRadius: theme.sizing.baseUnit,
}))(Image);

class ActionItem extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    imageSource: PropTypes.any, // eslint-disable-line
    label: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.string,
  };

  render() {
    return (
      <TouchableScale
        onPress={() =>
          this.props.onPress({
            id: this.props.id,
            transitionKey: 2,
          })
        }
      >
        <Cell>
          <CellImage source={this.props.imageSource} />
          <CellContent>
            <ChannelLabel label={this.props.label} />
            <H4>{this.props.title}</H4>
          </CellContent>
        </Cell>
        <Divider />
      </TouchableScale>
    );
  }
}

export default ActionItem;
