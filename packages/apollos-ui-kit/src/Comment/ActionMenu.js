import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../theme';
import styled from '../styled';
import Icon from '../Icon';
import Touchable from '../Touchable';

const ActionMenuIcon = withTheme(({ theme: { colors, sizing } }) => ({
  name: 'dots-three-vertical',
  size: sizing.baseUnit * 1.25,
  fill: colors.text.tertiary,
}))(Icon);

const ActionTouchable = styled(({ theme: { sizing } }) => ({
  padding: sizing.baseUnit, // Large padding to increase surface area for tapping
}))(Touchable);

const ActionPosition = styled({
  position: 'absolute',
  right: -8, // Negative value to offset padding.
})(View);

const ActionMenu = (props) => (
  <ActionPosition>
    <ActionTouchable {...props}>
      <ActionMenuIcon />
    </ActionTouchable>
  </ActionPosition>
);

ActionMenu.propTypes = {
  onPress: PropTypes.func,
};

export default ActionMenu;
