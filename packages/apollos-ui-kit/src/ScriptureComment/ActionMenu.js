import React from 'react';
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

const ActionTouchable = styled({
  position: 'absolute',
  padding: 16, // Large padding to increase surface area for tapping
  right: -8, // Negative value to offset padding.
})(Touchable);

const ActionMenu = (props) => (
  <ActionTouchable {...props}>
    <ActionMenuIcon />
  </ActionTouchable>
);

ActionMenu.propTypes = {
  onPress: PropTypes.func,
};

export default ActionMenu;
