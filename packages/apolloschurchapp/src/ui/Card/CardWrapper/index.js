import { compose, pure } from 'recompose';
import React from 'react';
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';

import { withIsLoading } from 'apolloschurchapp/src/ui/isLoading';
import styled from 'apolloschurchapp/src/ui/styled';
import { enhancer as mediaQuery } from 'apolloschurchapp/src/ui/MediaQuery';

const StyledCard = compose(
  withIsLoading,
  styled(({ theme, cardColor, forceRatio }) => ({
    // card styles
    backgroundColor: cardColor || theme.colors.background.paper,
    borderRadius: theme.sizing.borderRadius,
    aspectRatio: forceRatio,
    ...Platform.select(theme.shadows.default),
  })),
  mediaQuery(
    // responsive styles
    ({ md }) => ({ maxWidth: md }),
    styled(({ theme }) => ({
      // mobile
      marginHorizontal: theme.sizing.baseUnit / 2,
      marginVertical: theme.sizing.baseUnit / 4,
    })),
    styled(({ theme }) => ({
      // tablet
      marginHorizontal: theme.sizing.baseUnit,
      marginVertical: theme.sizing.baseUnit / 4,
    }))
  )
)(View);

/*
 * Overflow on iOS, when declared on the same element as a shadow, clips the shadow so overflow must
 * live on a child wrapper. https://github.com/facebook/react-native/issues/449
 */
const OverflowFix = styled(({ theme, forceRatio }) => ({
  borderRadius: theme.sizing.borderRadius,
  overflow: 'hidden',
  aspectRatio: forceRatio,
}))(View);

const Card = pure(({ children, isLoading, forceRatio, ...otherProps }) => (
  <StyledCard forceRatio={forceRatio} {...otherProps}>
    <OverflowFix forceRatio={forceRatio}>{children}</OverflowFix>
  </StyledCard>
));

Card.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.node,
  forceRatio: PropTypes.number,
  style: PropTypes.any, // eslint-disable-line
};

export default Card;
