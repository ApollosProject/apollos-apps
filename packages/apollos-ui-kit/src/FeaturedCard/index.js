import React from 'react';
// import { View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { withTheme, ThemeMixin } from '../theme';
import styled from '../styled';
import Card, { CardImage, CardContent } from '../Card';
import FlexedView from '../FlexedView';
import { H2, BodyText } from '../typography';
import { ButtonIcon } from '../Button';
import { ImageSourceType } from '../ConnectedImage';

const Image = withTheme(({ theme }) => ({
  overlayColor: theme.colors.primary,
  style: { aspectRatio: 1 },
}))(CardImage);

const StyledCard = withTheme(({ theme }) => ({
  cardColor: theme.colors.primary,
}))(Card);

const Content = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'flex-end',
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit * 2,
}))(CardContent);

const Description = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit,
}))(BodyText);

const ActionButton = withTheme(({ theme }) => ({
  fill: theme.colors.primary,
  size: theme.sizing.baseUnit * 1.5,
  iconPadding: theme.sizing.baseUnit * 0.75,
  style: {
    marginLeft: theme.sizing.baseUnit,
    backgroundColor: theme.colors.text.primary,
  },
}))(ButtonIcon);

const FeaturedCard = ({
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

      <Content>
        <FlexedView>
          <H2 numberOfLines={description ? 3 : 4}>{title}</H2>
          {description ? (
            <Description numberOfLines={2}>{description}</Description>
          ) : null}
        </FlexedView>
        {onPressAction ? (
          <ActionButton name={actionIcon} onPress={onPressAction} />
        ) : null}
      </Content>
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
  onPressAction: PropTypes.func,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
};

FeaturedCard.defaultProps = {
  actionIcon: 'play-solid',
};

FeaturedCard.displayName = 'MediaCard';

export default FeaturedCard;
