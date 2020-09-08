import { compose, pure } from 'recompose';
import React from 'react';
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';

import { withIsLoading } from '../../isLoading';
import styled from '../../styled';

const StyledCard = compose(
  withIsLoading,
  styled(({ theme, cardColor, inHorizontalList = false, forceRatio }) => ({
    // card styles
    backgroundColor: cardColor || theme.colors.background.paper || undefined, // bail out if no bg color
    borderRadius: theme.sizing.baseBorderRadius,
    ...(inHorizontalList
      ? {
          // provides spacing between cards also fixes android shadow needing "space" to render into
          margin: theme.sizing.baseUnit / 2,
          marginBottom: theme.sizing.baseUnit * 0.75,
        }
      : {
          marginHorizontal: theme.sizing.baseUnit,
          marginVertical: theme.sizing.baseUnit * 0.75,
        }),
    ...Platform.select(theme.shadows.default),
    ...(forceRatio ? { aspectRatio: forceRatio } : {}),
  }))
)(View);

/*
 * Overflow on iOS, when declared on the same element as a shadow, clips the shadow so overflow must
 * live on a child wrapper. https://github.com/facebook/react-native/issues/449
 */
const OverflowFix = styled(
  ({ theme, forceRatio }) => ({
    borderRadius: theme.sizing.baseBorderRadius,
    overflow: 'hidden',
    ...(forceRatio ? { aspectRatio: forceRatio } : {}),
  }),
  'ui-kit.CardWrapper.OverflowFix'
)(View);

const Card = pure(({ children, forceRatio, ...otherProps }) => (
  <StyledCard forceRatio={forceRatio} {...otherProps}>
    <OverflowFix forceRatio={forceRatio}>{children}</OverflowFix>
  </StyledCard>
));

Card.propTypes = {
  cardColor: PropTypes.string,
  children: PropTypes.node,
  forceRatio: PropTypes.number,
  style: PropTypes.any, // eslint-disable-line
};

export default Card;
