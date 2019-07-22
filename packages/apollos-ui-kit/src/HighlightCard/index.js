import React from 'react';
import { View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { withTheme, ThemeMixin } from '../theme';
import styled from '../styled';
import Card, { CardContent, CardLabel, CardImage } from '../Card';
import FlexedView from '../FlexedView';
import { H3, BodyText } from '../typography';
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

const Image = withTheme(({ theme, customTheme }) => ({
  maxAspectRatio: 1.2,
  minAspectRatio: 0.75,
  maintainAspectRatio: true,
  overlayColor: get(customTheme, 'colors.primary', theme.colors.black),
}))(CardImage);

const Content = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
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
  ({ customTheme, hasDescription, labelText, theme }) => ({
    title: labelText,
    theme: { colors: get(customTheme, 'colors', {}) },
    type: 'overlay',
    style: {
      ...(hasDescription ? { marginBottom: theme.sizing.baseUnit } : {}),
    },
  })
)(CardLabel);

const renderLabel = (description, LabelComponent, labelText, theme) => {
  let ComponentToRender = null;

  if (LabelComponent) {
    ComponentToRender = LabelComponent;
  } else if (labelText) {
    ComponentToRender = (
      <Label
        customTheme={theme}
        hasDescription={description}
        labelText={labelText}
      />
    );
  }

  return ComponentToRender;
};

const renderOnlyTitle = (title, actionIcon, hasAction) => (
  <ActionLayout hasDescription={false}>
    <FlexedActionLayoutText>
      <H3 numberOfLines={4}>{title}</H3>
    </FlexedActionLayoutText>
    {hasAction ? <ActionIcon name={actionIcon} /> : null}
  </ActionLayout>
);

const renderWithDescription = (title, actionIcon, description, hasAction) => (
  <>
    <H3 numberOfLines={3}>{title}</H3>
    <ActionLayout hasDescription>
      <FlexedActionLayoutText>
        <BodyText numberOfLines={2}>{description}</BodyText>
      </FlexedActionLayoutText>
      {hasAction ? <ActionIcon name={actionIcon} /> : null}
    </ActionLayout>
  </>
);

const HighlightCard = withIsLoading(
  ({
    image,
    title,
    actionIcon,
    description,
    hasAction,
    isLiked,
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
        <Image
          overlayType={'gradient-bottom'}
          customTheme={theme}
          source={image}
        />
        <Content>
          {renderLabel(description, LabelComponent, labelText, theme)}
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

HighlightCard.propTypes = {
  image: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  actionIcon: PropTypes.string,
  description: PropTypes.string,
  hasAction: PropTypes.bool,
  isLiked: PropTypes.bool,
  LabelComponent: PropTypes.element,
  labelText: PropTypes.string,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
};

HighlightCard.defaultProps = {
  actionIcon: 'play-solid',
};

export default HighlightCard;
