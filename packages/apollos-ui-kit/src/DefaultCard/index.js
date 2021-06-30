import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme, named } from '../theme';
import styled from '../styled';
import Card, { CardImage, CardLabel } from '../Card';
import Icon from '../Icon';
import { withIsLoading } from '../isLoading';
import { ImageSourceType } from '../ConnectedImage';

import ContentTitles from '../ContentTitles';

const Image = withTheme(
  () => ({
    minAspectRatio: 1.2,
    maxAspectRatio: 1.78,
    maintainAspectRatio: true,
  }),
  'ui-kit.DefaultCard.Image'
)(CardImage);

// We have to position `renderLabel/CardLabel/LabelComponent` in a `View` so `Label`s loading state is positioned correctly 💥
// We also only render this component if we have a label.
const LabelPositioning = styled(
  ({ theme }) => ({
    marginTop: -theme.sizing.baseUnit * 2,
    marginBottom: theme.sizing.baseUnit,
  }),
  'ui-kit.DefaultCard.LabelPositioning'
)(View);

const LiveIcon = withTheme(({ theme }) => ({
  name: 'live-dot',
  size: theme.helpers.rem(0.4375),
  style: { marginRight: theme.sizing.baseUnit * 0.5 },
}))(Icon);

const renderLabel = (isLoading, LabelComponent, labelText, summary, isLive) => {
  let ComponentToRender = null;

  if (LabelComponent) {
    ComponentToRender = <LabelPositioning>{LabelComponent}</LabelPositioning>;

    // this always shows a loading state for labels
  } else if (labelText || isLoading || isLive) {
    ComponentToRender = (
      <LabelPositioning>
        <CardLabel
          isLive={isLive}
          hasSummary={summary}
          title={labelText || (isLive ? 'Live' : null)}
          type={'secondary'}
          IconComponent={isLive ? LiveIcon : null}
        />
      </LabelPositioning>
    );
  }

  return ComponentToRender;
};

const DefaultCard = withIsLoading(
  ({
    coverImage,
    title,
    isLiked,
    isLoading,
    LabelComponent,
    labelText,
    summary,
    isLive,
  }) => (
    <Card isLoading={isLoading}>
      <Image source={coverImage} />

      {renderLabel(isLoading, LabelComponent, labelText, summary, isLive)}
      <ContentTitles title={title} summary={summary} isLiked={isLiked} />
    </Card>
  )
);

DefaultCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
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

DefaultCard.displayName = 'DefaultCard';

export default named('ui-kit.DefaultCard')(DefaultCard);
