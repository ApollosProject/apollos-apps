import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { useTheme } from '../theme';
import styled from '../styled';
import { H5 } from '../typography';
import Icon from '../Icon';
import FlexedView from '../FlexedView';

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

const LabelText = styled(
  ({ labelColor }) => ({
    color: labelColor,
  }),
  'ui-kit.ChannelLabel.LabelText'
)(H5);

const FlexedIconLayout = styled(
  ({ theme }) => ({
    marginRight: theme.sizing.baseUnit * 0.5,
    flex: 0,
  }),
  'ui-kit.ChannelLabel.FlexedIconLayout'
)(FlexedView);

const ChannelLabel = ({
  label,
  labelColor,
  icon,
  IconComponent,
  isLoading,
}) => {
  const theme = useTheme();
  const ComponentForIcon = IconComponent || Icon;
  return (
    <Wrapper>
      {icon || isLoading ? (
        <FlexedIconLayout>
          <ComponentForIcon
            name={icon}
            fill={theme.colors.text.tertiary}
            isLoading={!icon && isLoading}
          />
        </FlexedIconLayout>
      ) : null}
      {label || isLoading ? (
        <LabelText
          labelColor={labelColor || theme.colors.text.secondary}
          isLoading={!label && isLoading}
        >
          {label}
        </LabelText>
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
  labelColor: PropTypes.string,
};

export default ChannelLabel;
