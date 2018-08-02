import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { startCase, toLower } from 'lodash';

import { withThemeMixin, withTheme } from '/mobile/ui/theme';
// import Icon from '/mobile/ui/Icon';
import ChannelLabel from '/mobile/ui/ChannelLabel';
import GradientOverlayImage from '/mobile/ui/GradientOverlayImage';
import Card, { CardContent, CardActions } from '/mobile/ui/Card';
import { H3 } from '/mobile/ui/typography';
// import ConnectedImage from '/mobile/ui/ConnectedImage';
// import ProgressiveImage from '/mobile/ui/ProgressiveImage';

// import LikeButton from './LikeButton';

const enhance = compose(
  pure,
  withThemeMixin(({ isLight }) => ({
    type: isLight ? 'light' : 'dark',
  })),
  withTheme()
);

const FeedItemCard = enhance(
  ({
    images,
    title,
    channelType,
    channelTypeIcon,
    isLoading,
    isLight,
    isLiked,
    backgroundColor,
    theme,
    id,
    ...otherProps
  }) => (
    <Card isLoading={isLoading} cardColor={backgroundColor} {...otherProps}>
      <GradientOverlayImage
        isLoading={isLoading}
        source={images}
        overlayColor={backgroundColor}
      />
      <CardContent>
        <H3 isLoading={isLoading}>{title}</H3>
      </CardContent>
      <CardActions>
        <ChannelLabel
          label={startCase(toLower(channelType))}
          icon={channelTypeIcon}
          isLoading={isLoading}
          withFlex
        />
        {/* <LikeButton id={id}>
          <Icon
            name={isLiked ? 'like-solid' : 'like'}
            size={theme.helpers.rem(1.2)}
            fill={theme.colors.text.primary}
            isLoading={isLoading}
          />
        </LikeButton> */}
      </CardActions>
    </Card>
  )
);

const sourcePropType = PropTypes.oneOfType([
  PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string,
    })
  ),
  PropTypes.string,
]);

FeedItemCard.propTypes = {
  title: PropTypes.string.isRequired,
  images: sourcePropType,
  channelType: PropTypes.string,
  channelTypeIcon: PropTypes.string,
  isLoading: PropTypes.bool,
  isLiked: PropTypes.bool,
  isLight: PropTypes.bool,
  backgroundColor: PropTypes.string,
  style: PropTypes.any, // eslint-disable-line
};

FeedItemCard.defaultProps = {
  isLight: true,
  channelTypeIcon: null,
};

export default FeedItemCard;
