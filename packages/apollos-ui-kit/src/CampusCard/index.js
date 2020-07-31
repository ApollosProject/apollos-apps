import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Card, { CardContent } from '../Card';
import ConnectedImage, { ImageSourceType } from '../ConnectedImage';
import SideBySideView from '../SideBySideView';
import styled from '../styled';
import { H5, H6 } from '../typography';
import FlexedView from '../FlexedView';

const HorizontalLayout = styled(
  ({ theme }) => ({
    alignItems: 'center',
    height: theme.sizing.baseUnit * 6,
  }),
  'ui-kit.CampusCard.HorizontalLayout'
)(SideBySideView);

const Header = styled(
  ({ theme }) => ({
    height: theme.helpers.verticalRhythm(0.875),
  }),
  'ui-kit.CampusCard.Header'
)(SideBySideView);

const FlexedCardContent = styled(
  {
    flex: 1,
  },
  'ui-kit.CampusCard.FlexedCardContent'
)(CardContent);

const CampusImage = styled(
  {
    aspectRatio: 1,
    height: '100%',
    resizeMode: 'cover',
  },
  'ui-kit.CampusCard.CampusImage'
)(ConnectedImage);

// Fixes placeholder
const DistanceWrapper = styled(
  {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  'ui-kit.CampusCard.DistanceWrapper'
)(FlexedView);

const hasValidImages = (images) =>
  images && !images.includes(null) && !images.map((o) => o.uri).includes(null);

const CampusCard = memo(
  ({ title, description, distance, images, ...otherProps }) => (
    <Card
      isLoading={otherProps.isLoading || false}
      inHorizontalList
      {...otherProps}
    >
      <HorizontalLayout>
        {hasValidImages(images) ? <CampusImage source={images} /> : null}
        <FlexedCardContent>
          <Header>
            <H5>{title}</H5>
            {distance != null ? (
              <DistanceWrapper>
                <H6>
                  {Math.round(distance)}
                  mi
                </H6>
              </DistanceWrapper>
            ) : null}
          </Header>
          {description ? <H6>{description}</H6> : null}
        </FlexedCardContent>
      </HorizontalLayout>
    </Card>
  )
);

CampusCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  images: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  distance: PropTypes.number,
};

CampusCard.displayName = 'CampusCard';

export default CampusCard;
