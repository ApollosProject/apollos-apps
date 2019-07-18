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
  style: { aspectRatio: 1 },
}))(CardImage);

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
  marginTop: '-40%',
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit * 2, // TODO: refactor CardContent to have this be the default
}))(CardContent);

const ActionLayout = styled(({ theme, hasDescription }) => ({
  flexDirection: 'row',
  /* - `center` works in all situations including 1 line descriptions
   * - `flex-end` is needed only for when we have no description
   */
  alignItems: hasDescription ? 'center' : 'flex-end',
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
  ({ customTheme, hasDescription, isLive, labelText, theme }) => ({
    ...(isLive
      ? {
          title: labelText || 'Live',
          type: 'secondary',
          icon: 'live-dot',
          iconSize: 7,
        }
      : {
          title: labelText,
          theme: { colors: get(customTheme, 'colors', {}) },
          type: 'overlay',
        }),
    style: {
      ...(hasDescription ? { marginBottom: theme.sizing.baseUnit } : {}),
    },
  })
)(CardLabel);

const renderLabel = (description, LabelComponent, labelText, isLive, theme) => {
  let ComponentToRender = null;

  if (LabelComponent) {
    ComponentToRender = LabelComponent;
  } else if (labelText || isLive) {
    ComponentToRender = (
      <Label
        customTheme={theme}
        hasDescription={description}
        isLive={isLive}
        labelText={labelText}
      />
    );
  }

  return ComponentToRender;
};

const renderOnlyTitle = (title, actionIcon, hasAction) => (
  <ActionLayout hasDescription={false}>
    <FlexedActionLayoutText>
      <H2 numberOfLines={4}>{title}</H2>
    </FlexedActionLayoutText>
    {hasAction ? <ActionIcon name={actionIcon} /> : null}
  </ActionLayout>
);

const renderWithDescription = (title, actionIcon, description, hasAction) => (
  <>
    <H2 numberOfLines={3}>{title}</H2>
    <ActionLayout hasDescription>
      <FlexedActionLayoutText>
        <BodyText numberOfLines={2}>{description}</BodyText>
      </FlexedActionLayoutText>
      {hasAction ? <ActionIcon name={actionIcon} /> : null}
    </ActionLayout>
  </>
);

const FeaturedCard = withIsLoading(
  ({
    image,
    title,
    actionIcon,
    description,
    hasAction,
    isLiked,
    isLive,
    isLoading,
    LabelComponent,
    labelText,
    theme,
  }) => (
    <ThemeMixin
      mixin={{
        type: get(theme, 'type', 'dark').toLowerCase(), // not sure why we need toLowerCase
        colors: get(theme, 'colors', {}),
      }}
    >
      <StyledCard isLoading={isLoading}>
        <Image source={image} overlayType={'featured'} />

        <Content>
          {renderLabel(description, LabelComponent, labelText, isLive, theme)}
          {description
            ? renderWithDescription(title, actionIcon, description, hasAction)
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
  image: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  actionIcon: PropTypes.string,
  description: PropTypes.string,
  hasAction: PropTypes.bool,
  isLiked: PropTypes.bool,
  isLive: PropTypes.bool,
  LabelComponent: PropTypes.element,
  labelText: PropTypes.string,
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
