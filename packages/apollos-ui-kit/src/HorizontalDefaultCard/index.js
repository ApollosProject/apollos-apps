import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { useTheme, withTheme } from '../theme';
import styled from '../styled';
import Card, { CardImage, CardLabel } from '../Card';
import { withIsLoading } from '../isLoading';
import { ImageSourceType } from '../ConnectedImage';
import BackgroundImageBlur from '../BackgroundImageBlur';
import Icon from '../Icon';

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

const CheckmarkIcon = withTheme(
  ({ theme }) => ({
    size: theme.sizing.baseUnit,
    weight: 'fill',
    fill: theme.colors.success,
  }),
  'ui-kit.HorizontalDefaultCard.CheckmarkIcon'
)(Icon);

const CompletedLabel = ({ labelText, labelColor }) => (
  <CardLabel
    title={labelText}
    type={'secondary'}
    icon={'circle-outline-check-mark'}
    IconComponent={CheckmarkIcon}
    labelColor={labelColor}
  />
);

const HorizontalDefaultCard = withIsLoading(
  ({
    coverImage,
    isLiked,
    isLoading,
    summary,
    title,
    labelText,
    labelColor,
  }) => {
    const theme = useTheme();

    return (
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
                label={
                  labelText === 'Completed' ? (
                    <CompletedLabel
                      labelText={labelText}
                      labelColor={labelColor || theme.colors.success}
                    />
                  ) : undefined
                }
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
              label={
                labelText === 'Completed' ? (
                  <CompletedLabel
                    labelText={labelText}
                    labelColor={labelColor || theme.colors.success}
                  />
                ) : undefined
              }
            />
          </NoImageTitlesPositioner>
        )}
      </SquareCard>
    );
  }
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
  labelText: PropTypes.string,
  labelColor: PropTypes.string,
};

HorizontalDefaultCard.displayName = 'HorizontalDefaultCard';

export default HorizontalDefaultCard;
