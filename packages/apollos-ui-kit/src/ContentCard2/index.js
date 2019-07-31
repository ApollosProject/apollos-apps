import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../theme';
import styled from '../styled';
import Card, { CardImage, CardLabel, CardContent } from '../Card';
import { H3, BodyText } from '../typography';
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
  minAspectRatio: 1.2,
  maxAspectRatio: 1.5,
  overlayType: 'gradient-top',
  overlayColor: theme.colors.black,
}))(CardImage);

const withLabelStyles = styled(({ theme, hasSummary }) => ({
  ...(hasSummary ? { marginBottom: theme.sizing.baseUnit } : {}),
  // marginTop: -theme.sizing.baseUnit * 2,
}));

const Content = styled(({ theme }) => ({
  alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
  paddingHorizontal: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
  paddingBottom: theme.sizing.baseUnit * 2, // TODO: refactor CardContent to have this be the default
}))(CardContent);

const Summary = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit,
}))(BodyText);

const renderLabel = (LabelComponent, labelText, summary) => {
  let ComponentToRender = null;

  if (LabelComponent) {
    ComponentToRender = LabelComponent;
  } else if (labelText) {
    ComponentToRender = (
      <CardLabel hasSummary={summary} title={labelText} type={'secondary'} />
    );
  }

  return ComponentToRender;
};

const ContentCard2 = withIsLoading(
  ({
    coverImage,
    title,
    isLiked,
    isLoading,
    LabelComponent,
    labelText,
    summary,
  }) => (
    <Card isLoading={isLoading}>
      <Image source={coverImage} />

      <Content>
        {renderLabel(LabelComponent, labelText, summary)}
        {title ? <H3 numberOfLines={2}>{title}</H3> : null}
        {summary ? <Summary numberOfLines={2}>{summary}</Summary> : null}
      </Content>
      <LikeIconPositioning>
        <LikeIcon isLiked={isLiked} />
      </LikeIconPositioning>
    </Card>
  )
);

ContentCard2.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  title: PropTypes.string.isRequired,
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

ContentCard2.displayName = 'ContentCard2';

export default ContentCard2;
