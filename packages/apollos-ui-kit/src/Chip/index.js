import React from 'react';
import { compose, mapProps } from 'recompose';
import PropTypes from 'prop-types';
/* touchable native feedback currently is having flex layout issues on react-native android, so we
 * fall back to TouchableOpacity
 */
import { TouchableOpacity, View } from 'react-native';

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

const IconView = styled(
  ({ hasTitle }) => ({
    paddingRight: hasTitle ? 8 : null,
  }),
  'ui-kit.Chip.IconView'
)(View);

const TitleText = styled(
  {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  'ui-kit.Chip.TitleText'
)(H6);

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
  'ui-kit.Chip.StyledButton'
)(Button);

const Chip = enhance(
  ({
    children,
    icon,
    iconStyles = {},
    iconSize,
    selected,
    title,
    pill = false,
    chipList = false,
    ...buttonProps
  }) => {
    // TODO remove deprecated props
    if (icon)
      console.warn(
        'icon prop deprecated. Passing a custom Icon through children is recommended.'
      );
    return (
      <StyledButton
        TouchableComponent={TouchableOpacity}
        pill={pill}
        chipList={chipList}
        {...buttonProps}
      >
        <>
          {children}
          {icon ? (
            <IconView hasTitle={!!title}>
              <Icon name={icon} style={iconStyles} size={iconSize} />
            </IconView>
          ) : null}
          {title ? <TitleText>{title}</TitleText> : null}
        </>
      </StyledButton>
    );
  }
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
