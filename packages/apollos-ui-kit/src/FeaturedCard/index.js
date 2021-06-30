import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { withTheme, ThemeMixin, named } from '../theme';
import Card, { CardImage, CardLabel } from '../Card';
import Icon from '../Icon';
import { withIsLoading } from '../isLoading';
import { ImageSourceType } from '../ConnectedImage';

import ContentTitles from '../ContentTitles';

const StyledCard = withTheme(
  ({ theme }) => ({
    cardColor: theme.colors.primary,
  }),
  'ui-kit.FeaturedCard.StyledCard'
)(Card);

const Image = withTheme(
  ({ theme, isLoading }) => ({
    overlayColor: isLoading
      ? theme.colors.lightSecondary
      : theme.colors.primary,
    minAspectRatio: 1,
    maxAspectRatio: 1,
  }),
  'ui-kit.FeaturedCard.Image'
)(CardImage);

const Label = withTheme(
  ({ customTheme, hasSummary, isLive, labelText, theme }) => ({
    ...(isLive
      ? {
          title: labelText || 'Live',
          type: 'secondary',
        }
      : {
          title: labelText,
          theme: { colors: get(customTheme, 'colors', {}) },
          type: 'overlay',
        }),
    style: {
      ...(hasSummary ? { marginBottom: theme.sizing.baseUnit } : {}),
    },
  }),
  'ui-kit.FeaturedCard.Label'
)(CardLabel);

const LiveIcon = withTheme(
  ({ theme }) => ({
    name: 'live-dot',
    size: theme.helpers.rem(0.4375),
    style: { marginRight: theme.sizing.baseUnit * 0.5 },
  }),
  'ui-kit.FeaturedCard.LiveIcon'
)(Icon);

const renderLabel = (summary, labelText, isLive, theme) => {
  if (!labelText && !isLive) return null;

  return (
    <Label
      customTheme={theme}
      hasSummary={summary}
      isLive={isLive}
      labelText={labelText}
      icon="live-dot"
      IconComponent={isLive ? LiveIcon : null}
    />
  );
};

const FeaturedCard = withIsLoading(
  ({
    coverImage,
    title,
    isLiked,
    isLive,
    isLoading,
    LabelComponent,
    labelText,
    summary,
    theme,
  }) => (
    <ThemeMixin
      mixin={{
        type: get(theme, 'type', 'dark').toLowerCase(), // not sure why we need toLowerCase
        colors: get(theme, 'colors', {}),
      }}
    >
      <StyledCard isLoading={isLoading}>
        <Image
          source={coverImage}
          overlayType={'featured'}
          isLoading={isLoading}
        />
        <ContentTitles
          isLiked={isLiked}
          title={title}
          summary={summary}
          featured
          label={renderLabel(summary, LabelComponent, labelText, isLive, theme)}
        />
      </StyledCard>
    </ThemeMixin>
  )
);

FeaturedCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  title: PropTypes.string,
  actionIcon: PropTypes.string,
  hasAction: PropTypes.bool,
  isLiked: PropTypes.bool,
  isLive: PropTypes.bool,
  LabelComponent: PropTypes.element,
  labelText: PropTypes.string,
  summary: PropTypes.string,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
};

FeaturedCard.defaultProps = {
  actionIcon: 'play-solid',
};

FeaturedCard.displayName = 'FeaturedCard';

export default named('ui-kit.FeaturedCard')(FeaturedCard);
