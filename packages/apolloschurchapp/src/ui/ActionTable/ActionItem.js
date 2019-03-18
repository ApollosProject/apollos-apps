import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  Cell,
  H6,
  H4,
  styled,
  Divider,
  TouchableScale,
  withIsLoading,
  ConnectedImage,
  FlexedView,
} from '@apollosproject/ui-kit';

const CellImage = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 4,
  height: theme.sizing.baseUnit * 4,
  borderRadius: theme.sizing.baseUnit,
  overflow: 'hidden',
  marginRight: theme.sizing.baseUnit / 2,
}))(View);

const StyledDivider = styled(({ theme }) => ({
  marginLeft: theme.sizing.baseUnit * 5.5,
}))(Divider);

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6);

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
          <CellImage>
            <ConnectedImage source={this.props.imageSource} isLoading />
          </CellImage>
          <FlexedView>
            <StyledH6>{this.props.label}</StyledH6>
            <H4 numberOfLines={2} ellipsizeMode="tail">
              {this.props.title}
            </H4>
          </FlexedView>
        </Cell>
        <StyledDivider />
      </TouchableScale>
    );
  }
}

export default withIsLoading(ActionItem);
