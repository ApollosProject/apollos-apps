import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../theme';
import styled from '../styled';
import Card, { CardImage, CardLabel, CardContent } from '../Card';
import { H3 } from '../typography';
import Icon from '../Icon';
import { withIsLoading } from '../isLoading';
import { ImageSourceType } from '../ConnectedImage';

// We have to position `LikeIcon` in a `View` rather than `LikeIcon` directly so `LikeIcon`'s loading state is positioned correctly 💥
const LikeIconPositioning = styled(({ theme }) => ({
  position: 'absolute',
  top: theme.sizing.baseUnit * 1.5,
  right: theme.sizing.baseUnit * 1.5,
}))(View);

const LikeIcon = withTheme(({ theme, isLiked }) => ({
  fill: theme.colors.white,
  name: isLiked ? 'like-solid' : 'like',
  size: theme.sizing.baseUnit * 1.5,
}))(Icon);

const Image = withTheme(({ theme }) => ({
  minAspectRatio: 1,
  maxAspectRatio: 1,
  maintainAspectRatio: true,
  overlayColor: theme.colors.black,
  overlayType: 'gradient-top',
}))(CardImage);

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit * 2, // TODO: refactor CardContent to have this be the default
}))(CardContent);

// We have to position `renderLabel/CardLabel/LabelComponent` in a `View` so `Label`s loading state is positioned correctly 💥
// We also only render this component if we have a label.
const LabelPositioning = styled(({ theme }) => ({
  marginTop: -theme.sizing.baseUnit * 2,
  marginBottom: theme.sizing.baseUnit,
}))(View);

const renderLabel = (isLoading, LabelComponent, labelText) => {
  let ComponentToRender = null;

  if (LabelComponent) {
    ComponentToRender = <LabelPositioning>{LabelComponent}</LabelPositioning>;

    // this always shows a loading state for labels
  } else if (labelText || isLoading) {
    ComponentToRender = (
      <LabelPositioning>
        <CardLabel title={labelText} type={'secondary'} />
      </LabelPositioning>
    );
  }

  return ComponentToRender;
};

const HorizontalDefaultCard = withIsLoading(
  ({ coverImage, title, isLiked, isLoading, LabelComponent, labelText }) => (
    <Card isLoading={isLoading}>
      <Image source={coverImage} />

      <Content>
        {renderLabel(isLoading, LabelComponent, labelText)}
        {title ? <H3 numberOfLines={2}>{title}</H3> : null}
      </Content>
      <LikeIconPositioning>
        <LikeIcon isLiked={isLiked} />
      </LikeIconPositioning>
    </Card>
  )
);

HorizontalDefaultCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  isLiked: PropTypes.bool,
  isLive: PropTypes.bool,
  LabelComponent: PropTypes.element,
  labelText: PropTypes.string,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
};

HorizontalDefaultCard.displayName = 'HorizontalDefaultCard';

export default HorizontalDefaultCard;
