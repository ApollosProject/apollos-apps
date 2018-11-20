import { compose, pure } from 'recompose';
import React from 'react';
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';

import { withIsLoading } from '../../isLoading';
import styled from '../../styled';

const StyledCard = compose(
  withIsLoading,
  styled(({ theme, cardColor, inHorizontalList = false }) => ({
    // card styles
    backgroundColor: cardColor || theme.colors.background.paper || undefined, // bail out if no bg color
    borderRadius: theme.sizing.baseUnit,
    ...(inHorizontalList
      ? {
          // provides spacing between cards also fixes android shadow needing "space" to render into
          margin: theme.sizing.baseUnit / 2,
        }
      : {
          marginHorizontal: theme.sizing.baseUnit,
          marginVertical: theme.sizing.baseUnit * 0.75,
        }),
    ...Platform.select(theme.shadows.default),
  }))
)(View);

/*
 * Overflow on iOS, when declared on the same element as a shadow, clips the shadow so overflow must
 * live on a child wrapper. https://github.com/facebook/react-native/issues/449
 */
const OverflowFix = styled(({ theme, forceRatio }) => ({
  borderRadius: theme.sizing.baseUnit,
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
