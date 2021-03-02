import React from 'react';
import { View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { withTheme, ThemeMixin, named } from '../theme';
import styled from '../styled';
import Card, { CardImage, CardLabel, CardContent } from '../Card';
import FlexedView from '../FlexedView';
import { H2, BodyText } from '../typography';
import Icon from '../Icon';
import { withIsLoading } from '../isLoading';
import { ImageSourceType } from '../ConnectedImage';

const StyledCard = withTheme(
  ({ theme }) => ({
    cardColor: theme.colors.primary,
  }),
  'ui-kit.FeaturedCard.StyledCard'
)(Card);

// We have to position `LikeIcon` in a `View` rather than `LikeIcon` directly so `LikeIcon`'s loading state is positioned correctly 💥
const LikeIconPositioning = styled(
  ({ theme }) => ({
    position: 'absolute',
    top: theme.sizing.baseUnit * 1.5,
    right: theme.sizing.baseUnit * 1.5,
  }),
  'ui-kit.FeaturedCard.LikeIconPositioning'
)(View);

const LikeIcon = withTheme(
  ({ theme, isLiked }) => ({
    name: isLiked ? 'like-solid' : 'like',
    size: theme.sizing.baseUnit * 1.5,
    iconPadding: theme.sizing.baseUnit * 1.5,
  }),
  'ui-kit.FeaturedCard.LikeIcon'
)(Icon);

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

const Content = styled(
  ({ theme }) => ({
    alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
    marginTop: '-40%',
    paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
    paddingBottom: theme.sizing.baseUnit * 2, // TODO: refactor CardContent to have this be the default
  }),
  'ui-kit.FeaturedCard.Content'
)(CardContent);

const ActionLayout = styled(
  ({ theme, hasSummary }) => ({
    flexDirection: 'row',
    /* - `center` works in all situations including 1 line summaries
     * - `flex-end` is needed only for when we have no summary
     */
    alignItems: hasSummary ? 'center' : 'flex-end',
    paddingTop: theme.sizing.baseUnit,
  }),
  'ui-kit.FeaturedCard.ActionLayout'
)(View);

const FlexedActionLayoutText = styled(
  ({ theme }) => ({
    marginRight: theme.sizing.baseUnit, // spaces out text from `ActionIcon`. This has to live here for ActionIcon's loading state
  }),
  'ui-kit.FeaturedCard.FlexedActionLayoutText'
)(FlexedView);

const ActionIcon = withTheme(
  ({ theme }) => ({
    fill: theme.colors.text.primary,
    size: theme.sizing.baseUnit * 3,
  }),
  'ui-kit.FeaturedCard.ActionIcon'
)(Icon);

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
        IconComponent={isLive ? LiveIcon : null}
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
        <Image
          source={coverImage}
          overlayType={'featured'}
          isLoading={isLoading}
        />

        <Content>
          {renderLabel(summary, LabelComponent, labelText, isLive, theme)}
          {summary
            ? renderWithSummary(title, actionIcon, summary, hasAction)
            : renderOnlyTitle(title, actionIcon, hasAction)}
        </Content>
        {isLiked != null ? (
          <LikeIconPositioning>
            <LikeIcon isLiked={isLiked} />
          </LikeIconPositioning>
        ) : null}
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
