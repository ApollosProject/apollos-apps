import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { withTheme } from '../theme';
import styled from '../styled';
import Card, { CardImage, CardContent } from '../Card';
import { H5, BodySmall } from '../typography';
import Icon from '../Icon';
import { withIsLoading } from '../isLoading';
import { ImageSourceType } from '../ConnectedImage';

const SquareCard = styled(
  {
    width: 240,
    height: 240,
  },
  'ui-kit.HorizontalDefaultCard.SquareCard'
)(Card);

// We have to position `LikeIcon` in a `View` rather than `LikeIcon` directly so `LikeIcon`'s loading state is positioned correctly 💥
const LikeIconPositioning = styled(
  ({ theme }) => ({
    position: 'absolute',
    top: theme.sizing.baseUnit,
    right: theme.sizing.baseUnit,
  }),
  'ui-kit.HorizontalDefaultCard.LikeIconPositioning'
)(View);

const LikeIcon = withTheme(
  ({ theme, isLiked }) => ({
    fill: theme.colors.white,
    name: isLiked ? 'like-solid' : 'like',
    size: theme.sizing.baseUnit * 1.5,
  }),
  'ui-kit.HorizontalDefaultCard.LikeIcon'
)(Icon);

const Image = withTheme(
  ({ hasTitleAndSummary }) => ({
    minAspectRatio: hasTitleAndSummary ? 2 : 1.5, // adjusts `Image` height to fill available `Card` whitespace if there is no `Title` or `Summary`
    maxAspectRatio: hasTitleAndSummary ? 2 : 1.5, // adjusts `Image` height to fill available `Card` whitespace if there is no `Title` or `Summary`
    forceRatio: hasTitleAndSummary ? 2 : 1.5, // forces the placeholder to use the same ratio as above.
    maintainAspectRatio: true,
  }),
  'ui-kit.HorizontalDefaultCard.Image'
)(CardImage);

const Content = styled(
  ({ theme }) => ({
    alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
    paddingHorizontal: theme.sizing.baseUnit, // TODO: refactor CardContent to have this be the default
    paddingBottom: theme.sizing.baseUnit * 1.5, // TODO: refactor CardContent to have this be the default
  }),
  'ui-kit.HorizontalDefaultCard.Content'
)(CardContent);

const Summary = styled(
  ({ theme, hasTitle }) => ({
    color: theme.colors.text.tertiary,
    ...(hasTitle ? { paddingTop: theme.sizing.baseUnit / 2 } : {}),
  }),
  'ui-kit.HorizontalDefaultCard.Summary'
)(BodySmall);

const HorizontalDefaultCard = withIsLoading(
  ({ coverImage, isLiked, isLoading, summary, title }) => (
    <SquareCard isLoading={isLoading} inHorizontalList>
      <Image source={coverImage} hasTitleAndSummary={!!summary && !!title} />

      <Content>
        {title ? <H5 numberOfLines={2}>{title}</H5> : null}
        {summary ? (
          <Summary hasTitle={title} numberOfLines={2}>
            {summary}
          </Summary>
        ) : null}
      </Content>
      {isLiked != null ? (
        <LikeIconPositioning>
          <LikeIcon isLiked={isLiked} />
        </LikeIconPositioning>
      ) : null}
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
};

HorizontalDefaultCard.displayName = 'HorizontalDefaultCard';

export default HorizontalDefaultCard;
