import React from 'react';
import { compose, mapProps } from 'recompose';
import PropTypes from 'prop-types';
/* touchable native feedback currently is having flex layout issues on react-native android, so we
 * fall back to TouchableOpacity
 */
import { TouchableOpacity } from 'react-native';

import { H6 } from '../typography';
import Button from '../Button';
import Icon from '../Icon';
import { withTheme } from '../theme';
import styled from '../styled';

export { default as ChipList } from './List';

const enhance = compose(
  withTheme(),
  mapProps(({ theme, selected, ...otherProps }) => ({
    type: selected ? 'primary' : 'default',
    iconSize: theme.sizing.baseUnit,
    ...otherProps,
  }))
);

const TitleText = styled(({ withIcon }) => ({
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: withIcon ? 8 : null,
}))(H6);

const StyledButton = styled(
  ({ theme, chipList }) => ({
    alignItems: 'center',
    paddingHorizontal: theme.sizing.baseUnit * 0.75, // 12px
    height: theme.sizing.baseUnit * 2, // 32px
    ...(chipList
      ? {
          marginRight: theme.sizing.baseUnit / 2,
          marginBottom: theme.sizing.baseUnit / 2,
        }
      : {}),
  }),
  'Chip'
)(Button);

const Chip = enhance(
  ({
    icon,
    iconStyles = {},
    iconSize,
    selected,
    title,
    pill = false,
    chipList = false,
    ...buttonProps
  }) => (
    <StyledButton
      TouchableComponent={TouchableOpacity}
      pill={pill}
      chipList={chipList}
      {...buttonProps}
    >
      <>
        {icon ? <Icon name={icon} style={iconStyles} size={iconSize} /> : null}
        {title ? <TitleText withIcon={icon}>{title}</TitleText> : null}
      </>
    </StyledButton>
  )
);

Chip.propTypes = {
  icon: PropTypes.string,
  iconStyles: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  iconSize: PropTypes.number,
  selected: PropTypes.bool,
  title: PropTypes.string,
  pill: PropTypes.bool,
};

export default Chip;
