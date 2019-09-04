import React from 'react';
import { View } from 'react-native';
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

const SquareCard = styled({
  width: 240,
  height: 240,
})(Card);

// We have to position `LikeIcon` in a `View` rather than `LikeIcon` directly so `LikeIcon`'s loading state is positioned correctly 💥
const LikeIconPositioning = styled(
  ({ theme }) => ({
    position: 'absolute',
    top: theme.sizing.baseUnit,
    right: theme.sizing.baseUnit,
  }),
  'ui-kit.HorizontalHighlightCard.LikeIconPositioning'
)(View);

const LikeIcon = withTheme(({ theme, isLiked }) => ({
  name: isLiked ? 'like-solid' : 'like',
  size: theme.sizing.baseUnit * 1.5,
}))(Icon);

const Image = withTheme(({ customTheme, theme }) => ({
  minAspectRatio: 1,
  maxAspectRatio: 1,
  maintainAspectRatio: true,
  forceRatio: 1, // fixes loading state
  overlayColor: get(customTheme, 'colors.primary', theme.colors.black),
}))(CardImage);

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

const FlexedActionLayoutText = styled(({ theme }) => ({
  marginRight: theme.sizing.baseUnit, // spaces out text from `ActionIcon`. This has to live here for ActionIcon's loading state
}))(FlexedView);

const ActionIcon = withTheme(({ theme }) => ({
  fill: theme.colors.text.primary,
  size: theme.sizing.baseUnit * 2,
}))(Icon);

const Label = withTheme(({ customTheme, labelText }) => ({
  title: labelText,
  theme: { colors: get(customTheme, 'colors', {}) },
  type: 'overlay',
}))(CardLabel);

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
      <SquareCard isLoading={isLoading} inHorizontalList {...props}>
        <Image
          overlayType={'gradient-bottom'}
          customTheme={theme}
          source={coverImage}
        />
        <Content>
          {renderLabel(LabelComponent, labelText, theme)}
          <ActionLayout>
            <FlexedActionLayoutText>
              <H3 numberOfLines={4}>{title}</H3>
            </FlexedActionLayoutText>
            {hasAction ? <ActionIcon name={actionIcon} /> : null}
          </ActionLayout>
        </Content>
        <LikeIconPositioning>
          <LikeIcon isLiked={isLiked} />
        </LikeIconPositioning>
      </SquareCard>
    </ThemeMixin>
  )
);

HorizontalHighlightCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  actionIcon: PropTypes.string,
  hasAction: PropTypes.bool,
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
