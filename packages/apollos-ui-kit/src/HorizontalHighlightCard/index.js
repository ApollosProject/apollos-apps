import React from 'react';
import { Platform, View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { withTheme, ThemeMixin } from '../theme';
import styled from '../styled';
import Card, { CardContent, CardLabel, CardImage } from '../Card';
import FlexedView from '../FlexedView';
import { H3 } from '../typography';
import Icon from '../Icon';
import { withIsLoading } from '../isLoading';
import { ImageSourceType } from '../ConnectedImage';

const SquareCard = styled(
  ({ disabled }) => ({
    width: 240,
    height: 240,
    // This hides/removes the built in shadow from `Card` if this component `disabled`.
    ...Platform.select({
      ios: {
        ...(disabled ? { shadowOpacity: 0 } : {}),
      },
      android: {
        ...(disabled ? { elevation: 0 } : {}),
      },
    }),
  }),
  'ui-kit.HorizontalHighlightCard.SquareCard'
)(Card);

// We have to position `LikeIcon` in a `View` rather than `LikeIcon` directly so `LikeIcon`'s loading state is positioned correctly 💥
const LikeIconPositioning = styled(
  ({ theme }) => ({
    position: 'absolute',
    top: theme.sizing.baseUnit,
    right: theme.sizing.baseUnit,
  }),
  'ui-kit.HorizontalHighlightCard.LikeIconPositioning'
)(View);

const LikeIcon = withTheme(
  ({ theme, isLiked }) => ({
    name: isLiked ? 'like-solid' : 'like',
    size: theme.sizing.baseUnit * 1.5,
  }),
  'ui-kit.HorizontalHighlightCard.LikeIcon'
)(Icon);

const Image = withTheme(
  ({ customTheme, theme, disabled }) => ({
    minAspectRatio: 1,
    maxAspectRatio: 1,
    maintainAspectRatio: true,
    forceRatio: 1, // fixes loading state
    overlayColor: disabled // There are effectively 3 conditions here for `overlayColor`.
      ? theme.colors.white // if `disabled` use white
      : get(customTheme, 'colors.primary', theme.colors.black), // else check for a custom theme (prop) or default to black.
    overlayType: disabled ? 'medium' : 'gradient-bottom',
  }),
  'ui-kit.HorizontalHighlightCard.Image'
)(CardImage);

const Content = styled(
  ({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
    paddingHorizontal: theme.sizing.baseUnit, // TODO: refactor CardContent to have this be the default
    paddingBottom: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
  }),
  'ui-kit.HorizontalHighlightCard.Content'
)(CardContent);

const ActionLayout = styled(
  ({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: theme.sizing.baseUnit,
  }),
  'ui-kit.HorizontalHighlightCard.ActionLayout'
)(View);

const FlexedActionLayoutText = styled(
  ({ theme, hasAction }) => ({
    ...(hasAction ? { marginRight: theme.sizing.baseUnit } : {}), // spaces out text from `ActionIcon`. This has to live here for ActionIcon's loading state
  }),
  'ui-kit.HorizontalHighlightCard.FlexedActionLayoutText'
)(FlexedView);

const ActionIcon = withTheme(
  ({ theme }) => ({
    fill: theme.colors.text.primary,
    size: theme.sizing.baseUnit * 2,
  }),
  'ui-kit.HorizontalHighlightCard.ActionIcon'
)(Icon);

const Label = withTheme(
  ({ customTheme, labelText }) => ({
    title: labelText,
    theme: { colors: get(customTheme, 'colors', {}) },
    type: 'overlay',
  }),
  'ui-kit.HorizontalHighlightCard.Label'
)(CardLabel);

const renderLabel = (LabelComponent, labelText, theme) => {
  let ComponentToRender = null;

  if (LabelComponent) {
    ComponentToRender = LabelComponent;
  } else if (labelText) {
    ComponentToRender = <Label customTheme={theme} labelText={labelText} />;
  }

  return ComponentToRender;
};

const HorizontalHighlightCard = withIsLoading(
  ({
    coverImage,
    title,
    actionIcon,
    hasAction,
    disabled,
    isLiked,
    isLoading,
    LabelComponent,
    labelText,
    theme,
    ...props
  }) => (
    <ThemeMixin
      mixin={{
        type: get(theme, 'type', 'dark').toLowerCase(), // not sure why we need toLowerCase
        colors: get(theme, 'colors', {}),
      }}
    >
      <SquareCard
        isLoading={isLoading}
        inHorizontalList
        disabled={disabled}
        {...props}
      >
        <Image customTheme={theme} source={coverImage} disabled={disabled} />
        <Content>
          {renderLabel(LabelComponent, labelText, theme)}
          <ActionLayout>
            <FlexedActionLayoutText hasAction={hasAction}>
              <H3 numberOfLines={4}>{title}</H3>
            </FlexedActionLayoutText>
            {hasAction ? <ActionIcon name={actionIcon} /> : null}
          </ActionLayout>
        </Content>
        {isLiked != null ? (
          <LikeIconPositioning>
            <LikeIcon isLiked={isLiked} />
          </LikeIconPositioning>
        ) : null}
      </SquareCard>
    </ThemeMixin>
  )
);

HorizontalHighlightCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  title: PropTypes.string,
  actionIcon: PropTypes.string,
  hasAction: PropTypes.bool,
  disabled: PropTypes.bool, // "Disabled state". Alternatively use this to highlight/differentiate the "active" card in a list.
  isLiked: PropTypes.bool,
  LabelComponent: PropTypes.element,
  labelText: PropTypes.string,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
};

HorizontalHighlightCard.defaultProps = {
  actionIcon: 'play-opaque',
};

export default HorizontalHighlightCard;
