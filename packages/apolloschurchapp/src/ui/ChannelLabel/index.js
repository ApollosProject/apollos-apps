import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { kebabCase } from 'lodash';

import { withIsLoading } from 'apolloschurchapp/src/ui/isLoading';
import { withTheme } from 'apolloschurchapp/src/ui/theme';
import styled from 'apolloschurchapp/src/ui/styled';
import { H6 } from 'apolloschurchapp/src/ui/typography';
import Icon from 'apolloschurchapp/src/ui/Icon';
import * as Icons from 'apolloschurchapp/src/ui/Icon/icons';

const enhance = compose(
  withIsLoading,
  pure,
  withTheme()
);

const Wrapper = styled(({ flexed }) => ({
  flex: flexed ? 1 : null,
  flexDirection: 'row',
  alignItems: 'center',
}))(View);

const PlaceholderWrapper = styled(({ theme, withIcon }) => ({
  flex: 1,
  ...(withIcon
    ? { paddingHorizontal: theme.sizing.baseUnit / 2 }
    : { paddingRight: theme.sizing.baseUnit / 2 }),
}))(View);

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H6);

const ChannelLabel = enhance(({ label, icon, withFlex, isLoading, theme }) => (
  <Wrapper flexed={withFlex}>
    {icon ? (
      <Icon
        name={icon}
        size={theme.helpers.rem(1.2)}
        fill={theme.colors.text.secondary}
        isLoading={isLoading}
      />
    ) : null}
    <PlaceholderWrapper withIcon={icon}>
      <StyledH6>{label}</StyledH6>
    </PlaceholderWrapper>
  </Wrapper>
));

ChannelLabel.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  icon: PropTypes.oneOf(Object.keys(Icons).map(kebabCase)),
  isLoading: PropTypes.bool,
  withFlex: PropTypes.bool,
};

ChannelLabel.defaultProps = {
  withFlex: false,
};

export default ChannelLabel;
