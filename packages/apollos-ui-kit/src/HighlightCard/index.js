import React from 'react';
import { StyleSheet, View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import Color from 'color';
import LinearGradient from 'react-native-linear-gradient';

import { withTheme, ThemeMixin } from '../theme';
import styled from '../styled';
import Card, { CardContent } from '../Card';
import ConnectedImage, { ImageSourceType } from '../ConnectedImage';
import FlexedView from '../FlexedView';
import { H3, BodyText } from '../typography';
import { ButtonIcon } from '../Button';
import { ImageSourceType } from '../ConnectedImage';

const Overlay = styled(StyleSheet.absoluteFillObject)(LinearGradient);

const StyledCard = withTheme(({ theme }) => ({
  cardColor: theme.colors.primary,
}))(Card);

const LikeButtonWrapper = styled({
  position: 'absolute',
  top: 0,
  right: 0,
})(View);

const Image = withTheme(({ theme }) => ({
  overlayColor: theme.colors.primary,
  maxAspectRatio: 1.2,
  minAspectRatio: 0.75,
  maintainAspectRatio: true,
}))(ConnectedImage);

const Content = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  flexDirection: 'row',
  alignItems: 'flex-start',
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit * 2,
}))(CardContent);

const ActionLayout = styled(({ theme, hasDescription }) => ({
  flexDirection: 'row',
  /* - `center` works in all situations including 1 line descriptions
   * - `flex-end` is needed only for when we have no description
   */
  alignItems: hasDescription ? 'center' : 'flex-end',
  paddingTop: theme.sizing.baseUnit,
}))(View);

const ActionButton = withTheme(({ theme }) => ({
  fill: theme.colors.primary,
  size: theme.sizing.baseUnit * 1.5,
  iconPadding: theme.sizing.baseUnit * 0.75,
  style: {
    marginLeft: theme.sizing.baseUnit,
    backgroundColor: theme.colors.text.primary,
  },
}))(ButtonIcon);

const Label = withTheme(
  ({ customTheme, hasDescription, labelText, theme }) => ({
    type: labelText.toLowerCase() === 'live' ? 'secondary' : 'overlay',
    icon: labelText.toLowerCase() === 'live' ? 'live-dot' : '',
    theme: { colors: get(customTheme, 'colors', {}) },
    title: labelText,
    iconSize: 7,
    style: {
      ...(hasDescription ? { marginBottom: theme.sizing.baseUnit } : {}),
    },
  })
)(CardLabel);

const Description = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit,
}))(BodyText);

const CardOverlay = withTheme(
  ({
    theme: {
      type,
      colors: { white, black },
      alpha: { low, medium },
    },
  }) => ({
    colors: [
      Color(type === 'light' ? white : black).fade(medium),
      Color(type === 'light' ? white : black).fade(low),
    ],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    locations: [0, 1],
  })
)(Overlay);

const HighlightCard = ({
  image,
  title,
  actionIcon,
  description,
  onPressAction,
  theme,
}) => (
  <ThemeMixin
    mixin={{
      type: get(theme, 'type', 'dark').toLowerCase(), // not sure why we need toLowerCase
      colors: get(theme, 'colors', {}),
    }}
  >
    <StyledCard>
      <Image source={image} />
      <CardOverlay />
      <Content>
        {labelText
          ? // if we have a custom `LabelComponent` render it
            LabelComponent || ( // otherwise default to `Label`
              <Label
                customTheme={theme}
                labelText={labelText}
                hasDescription={description}
              />
            )
          : null}
          {// only if we have a `description` render a shorter full width `H2` `title`
        description ? <H2 numberOfLines={3}>{title}</H2> : null}
        <ActionLayout hasDescription={description}>
          <FlexedView>
            {// if we have a `description` render it otherwise render a longer but narrower `H2` `title`
            description ? (
              <BodyText numberOfLines={2}>{description}</BodyText>
            ) : (
              <H2 numberOfLines={4}>{title}</H2>
            )}
          </FlexedView>
          {onPressAction ? (
            <ActionButton name={actionIcon} onPress={onPressAction} />
          ) : null}
        </ActionLayout>
      </Content>
      <LikeButtonWrapper>
        <LikeButton
          name={isLiked ? 'like-solid' : 'like'}
          onPress={onPressLike}
        />
      </LikeButtonWrapper>
    </StyledCard>
  </ThemeMixin>
);

FeaturedCard.propTypes = {
  image: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  actionIcon: PropTypes.string,
  description: PropTypes.string,
  isLiked: PropTypes.bool,
  LabelComponent: PropTypes.element,
  labelText: PropTypes.string,
  onPressAction: PropTypes.func,
  onPressLike: PropTypes.func,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
};


HighlightCard.defaultProps = {
  actionIcon: 'play-solid',
};

HighlightCard.displayName = 'HighlightCard';

export default HighlightCard;
