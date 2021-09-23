import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { withTheme } from '../theme';
import styled from '../styled';
import Card, { CardImage } from '../Card';
import { withIsLoading } from '../isLoading';
import { ImageSourceType } from '../ConnectedImage';
import BackgroundImageBlur from '../BackgroundImageBlur';

import ContentTitles from '../ContentTitles';

const SquareCard = styled(
  {
    width: 240,
    height: 240,
  },
  'ui-kit.HorizontalDefaultCard.SquareCard'
)(Card);

const TitlesPositioner = styled({
  height: 240 - 135,
  justifyContent: 'center',
})(View);

const NoImageTitlesPositioner = styled({
  height: 240,
  justifyContent: 'center',
})(View);

const Image = withTheme(
  () => ({
    width: 240,
    height: 135,
    minAspectRatio: 240 / 135,
    maxAspectRatio: 240 / 135,
  }),
  'ui-kit.HorizontalDefaultCard.Image'
)(CardImage);

const HorizontalDefaultCard = withIsLoading(
  ({ coverImage, isLiked, isLoading, summary, title }) => (
    <SquareCard isLoading={isLoading} inHorizontalList>
      {coverImage ? (
        <>
          <BackgroundImageBlur source={coverImage} />
          <Image
            source={coverImage}
            hasTitleAndSummary={!!summary && !!title}
          />
          <TitlesPositioner>
            <ContentTitles
              micro
              title={title}
              summary={summary}
              isLiked={isLiked}
              isLoading={isLoading}
            />
          </TitlesPositioner>
        </>
      ) : (
        <NoImageTitlesPositioner>
          <ContentTitles
            micro
            title={title}
            summary={summary}
            isLiked={isLiked}
            isLoading={isLoading}
          />
        </NoImageTitlesPositioner>
      )}
    </SquareCard>
  )
);

HorizontalDefaultCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  isLiked: PropTypes.bool,
  summary: PropTypes.string,
  title: PropTypes.string,
  isLoading: PropTypes.bool,
};

HorizontalDefaultCard.displayName = 'HorizontalDefaultCard';

export default HorizontalDefaultCard;
