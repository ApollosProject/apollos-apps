import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { useTheme } from '../theme';
import styled from '../styled';
import { H4 } from '../typography';
import Icon from '../Icon';

/**
 * ChannelLabel
 * Implements https://www.figma.com/file/YHJLj8pdFxWG9npF2YmB3r/UI-Kit-2.0?node-id=9%3A415
 *
 * Status:
 * - [x] label
 * - [ ] micro
 * - [ ] image thumbnail
 * - [ ] loading state
 * - [x] icon
 * */

const Wrapper = styled(
  ({ flexed }) => ({
    flex: flexed ? 1 : null,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  'ui-kit.ChannelLabel.Wrapper'
)(View);

const LabelText = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H4);

const ChannelLabel = ({ label, icon, IconComponent, isLoading }) => {
  const theme = useTheme();
  const ComponentForIcon = IconComponent || Icon;
  return (
    <Wrapper>
      {icon || isLoading ? (
        <ComponentForIcon
          name={icon}
          fill={theme.colors.text.tertiary}
          isLoading={!icon && isLoading}
        />
      ) : null}
      {label || isLoading ? (
        <LabelText isLoading={!label && isLoading}>{label}</LabelText>
      ) : null}
    </Wrapper>
  );
};

ChannelLabel.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  IconComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.element,
  ]),
  isLoading: PropTypes.bool,
};

export default ChannelLabel;
