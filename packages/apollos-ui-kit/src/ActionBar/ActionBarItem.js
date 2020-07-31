import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styled from '../styled';
import Touchable from '../Touchable';
import { UIText } from '../typography';
import Icon from '../Icon';
import { withTheme } from '../theme';

const ActionBarItemWrapper = styled(
  ({ theme }) => ({
    padding: theme.sizing.baseUnit,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  'ui-kit.ActionBar.ActionBarItem.ActionBarItemWrapper'
)(View);

const ActionBarItem = ({
  icon = 'empty',
  tint,
  size,
  label = '',
  ...touchableProps
}) => (
  <Touchable {...touchableProps}>
    <ActionBarItemWrapper>
      <Icon fill={tint} size={size} name={icon} />

      {/* using stlye object here is just as efficient as creating a new styled component with prop, since UIText is already a styled component */}
      <UIText style={{ color: tint }}>{label}</UIText>
    </ActionBarItemWrapper>
  </Touchable>
);

ActionBarItem.propTypes = {
  icon: PropTypes.string,
  size: PropTypes.number,
  label: PropTypes.string,
  tint: PropTypes.string,
};

export default withTheme(
  ({ theme, ...props }) => ({
    tint: theme.colors.action.primary,
    size: theme.sizing.baseUnit * 1.5,
    ...props,
  }),
  'ui-kit.ActionBar.ActionBarItem.ActionBarItem'
)(ActionBarItem);
