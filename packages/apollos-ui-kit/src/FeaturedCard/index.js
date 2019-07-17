import React from 'react';
import { View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { withTheme, ThemeMixin } from '../theme';
import styled from '../styled';
import Card, { CardImage, CardLabel, CardContent } from '../Card';
import FlexedView from '../FlexedView';
import { H2, BodyText } from '../typography';
import { ButtonIcon } from '../Button';
import { ImageSourceType } from '../ConnectedImage';

const StyledCard = withTheme(({ theme }) => ({
  cardColor: theme.colors.primary,
}))(Card);

const LikeButtonWrapper = styled({
  position: 'absolute',
  top: 0,
  right: 0,
})(View);

const LikeButton = withTheme(({ theme }) => ({
  size: theme.sizing.baseUnit * 1.5,
  iconPadding: theme.sizing.baseUnit * 1.5,
}))(ButtonIcon);

const Image = withTheme(({ theme }) => ({
  overlayColor: theme.colors.primary,
  style: { aspectRatio: 1 },
}))(CardImage);

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start',
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

const FeaturedCard = ({
  image,
  title,
  actionIcon,
  description,
  isLiked,
  LabelComponent,
  labelText,
  onPressAction,
  onPressLike,
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

      <Content>
        {labelText // only render a label if we have `labelText`
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

FeaturedCard.defaultProps = {
  actionIcon: 'play-solid',
};

FeaturedCard.displayName = 'FeaturedCard';

export default FeaturedCard;
