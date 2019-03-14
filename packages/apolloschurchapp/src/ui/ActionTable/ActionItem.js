import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

import {
  Cell,
  ChannelLabel,
  H4,
  CellContent,
  styled,
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
    imageSource: PropTypes.number,
    label: PropTypes.string,
    title: PropTypes.string,
  };

  render() {
    return (
      <TouchableScale
        onPress={() =>
          this.props.onPress({
            id: 'ContentChannelItem:asdfhakljdshflkajhsdflkahsdf',
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
      </TouchableScale>
    );
  }
}

export default ActionItem;
