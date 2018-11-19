import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { kebabCase } from 'lodash';

import { withIsLoading } from '../isLoading';
import { withTheme } from '../theme';
import styled from '../styled';
import { H6 } from '../typography';
import Icon from '../Icon';
import * as Icons from '../Icon/icons';

const enhance = compose(
  withIsLoading,
  pure,
  withTheme(({ theme, tint, iconSize }) => ({
    tint: tint || theme.colors.text.tertiary,
    iconSize: iconSize || theme.helpers.rem(1.2),
  }))
);

const Wrapper = styled(({ flexed }) => ({
  flex: flexed ? 1 : null,
  flexDirection: 'row',
  alignItems: 'center',
}))(View);

const PlaceholderWrapper = styled(({ theme, withIcon }) => ({
  ...(withIcon
    ? { paddingHorizontal: theme.sizing.baseUnit / 4 }
    : { paddingRight: theme.sizing.baseUnit / 4 }),
}))(View);

const StyledH6 = styled(({ tint }) => ({
  color: tint,
}))(H6);

const ChannelLabel = enhance(
  ({ label, tint, icon, withFlex, isLoading, iconSize }) => (
    <Wrapper flexed={withFlex}>
      {icon ? (
        <Icon name={icon} size={iconSize} fill={tint} isLoading={isLoading} />
      ) : null}
      <PlaceholderWrapper withIcon={icon}>
        <StyledH6 tint={tint}>{label}</StyledH6>
      </PlaceholderWrapper>
    </Wrapper>
  )
);

ChannelLabel.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  icon: PropTypes.oneOf(Object.keys(Icons).map(kebabCase)),
  isLoading: PropTypes.bool,
  withFlex: PropTypes.bool,
  color: PropTypes.string,
};

ChannelLabel.defaultProps = {
  withFlex: false,
};

export default ChannelLabel;
