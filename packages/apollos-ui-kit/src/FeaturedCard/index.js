import React from 'react';
import { View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { withTheme, ThemeMixin } from '../theme';
import styled from '../styled';
import Card, { CardImage, CardLabel, CardContent } from '../Card';
import FlexedView from '../FlexedView';
import { H2, BodyText } from '../typography';
import Icon from '../Icon';
import { withIsLoading } from '../isLoading';
import { ImageSourceType } from '../ConnectedImage';

const StyledCard = withTheme(({ theme }) => ({
  cardColor: theme.colors.primary,
}))(Card);

// We have to position `LikeIcon` in a `View` rather than `LikeIcon` directly so `LikeIcon`'s loading state is positioned correctly 💥
const LikeIconPositioning = styled(({ theme }) => ({
  position: 'absolute',
  top: theme.sizing.baseUnit * 1.5,
  right: theme.sizing.baseUnit * 1.5,
}))(View);

const LikeIcon = withTheme(({ theme, isLiked }) => ({
  name: isLiked ? 'like-solid' : 'like',
  size: theme.sizing.baseUnit * 1.5,
  iconPadding: theme.sizing.baseUnit * 1.5,
}))(Icon);

const Image = withTheme(({ theme }) => ({
  overlayColor: theme.colors.primary,
  minAspectRatio: 1,
  maxAspectRatio: 1,
}))(CardImage);

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
  marginTop: '-40%',
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit * 2, // TODO: refactor CardContent to have this be the default
}))(CardContent);

const ActionLayout = styled(({ theme, hasSummary }) => ({
  flexDirection: 'row',
  /* - `center` works in all situations including 1 line summaries
   * - `flex-end` is needed only for when we have no summary
   */
  alignItems: hasSummary ? 'center' : 'flex-end',
  paddingTop: theme.sizing.baseUnit,
}))(View);

const FlexedActionLayoutText = styled(({ theme }) => ({
  marginRight: theme.sizing.baseUnit, // spaces out text from `ActionIcon`. This has to live here for ActionIcon's loading state
}))(FlexedView);

const ActionIcon = withTheme(({ theme }) => ({
  fill: theme.colors.text.primary,
  size: theme.sizing.baseUnit * 3,
}))(Icon);

const Label = withTheme(
  ({ customTheme, hasSummary, isLive, labelText, theme }) => ({
    ...(isLive
      ? {
          title: labelText || 'Live',
          type: 'secondary',
          icon: 'live-dot',
          iconSize: theme.helpers.rem(0.4375), // using our typographic size unit based on fontSize so that the icon scales correctly with font size changes.
        }
      : {
          title: labelText,
          theme: { colors: get(customTheme, 'colors', {}) },
          type: 'overlay',
        }),
    style: {
      ...(hasSummary ? { marginBottom: theme.sizing.baseUnit } : {}),
    },
  })
)(CardLabel);

const renderLabel = (summary, LabelComponent, labelText, isLive, theme) => {
  let ComponentToRender = null;

  if (LabelComponent) {
    ComponentToRender = LabelComponent;
  } else if (labelText || isLive) {
    ComponentToRender = (
      <Label
        customTheme={theme}
        hasSummary={summary}
        isLive={isLive}
        labelText={labelText}
      />
    );
  }

  return ComponentToRender;
};

const renderOnlyTitle = (title, actionIcon, hasAction) => (
  <ActionLayout hasSummary={false}>
    <FlexedActionLayoutText>
      <H2 numberOfLines={4}>{title}</H2>
    </FlexedActionLayoutText>
    {hasAction ? <ActionIcon name={actionIcon} /> : null}
  </ActionLayout>
);

const renderWithSummary = (title, actionIcon, summary, hasAction) => (
  <>
    <H2 numberOfLines={3}>{title}</H2>
    <ActionLayout hasSummary>
      <FlexedActionLayoutText>
        <BodyText numberOfLines={2}>{summary}</BodyText>
      </FlexedActionLayoutText>
      {hasAction ? <ActionIcon name={actionIcon} /> : null}
    </ActionLayout>
  </>
);

const FeaturedCard = withIsLoading(
  ({
    coverImage,
    title,
    actionIcon,
    hasAction,
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
        <Image source={coverImage} overlayType={'featured'} />

        <Content>
          {renderLabel(summary, LabelComponent, labelText, isLive, theme)}
          {summary
            ? renderWithSummary(title, actionIcon, summary, hasAction)
            : renderOnlyTitle(title, actionIcon, hasAction)}
        </Content>
        <LikeIconPositioning>
          <LikeIcon isLiked={isLiked} />
        </LikeIconPositioning>
      </StyledCard>
    </ThemeMixin>
  )
);

FeaturedCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  title: PropTypes.string.isRequired,
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

export default FeaturedCard;
