import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { Dimensions, View } from 'react-native';

import Card, { CardContent } from '../Card';
import ConnectedImage from '../ConnectedImage';
import SideBySideView from '../SideBySideView';
import { withIsLoading } from '../isLoading';
import styled from '../styled';
import { H5, H6 } from '../typography';

const { width } = Dimensions.get('window');

/* TODO: remove magic number. `theme.sizing.baseUnit * 2.25` This width value is a brittle
 * calculation of width minus `CampusCard` margins */
export const CARD_WIDTH = width - 36;

const enhance = compose(
  withIsLoading,
  pure
);

const HorizontalLayout = styled({
  alignItems: 'center',
})(SideBySideView);

const HorizontalTextLayout = styled(({ theme }) => ({
  height: theme.helpers.verticalRhythm(0.875),
}))(SideBySideView);

const RightColumn = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 0.85,
  flex: 1,
}))(CardContent);

const CampusImage = styled({
  aspectRatio: 1,
  height: '100%',
  alignSelf: 'stretch',
  resizeMode: 'cover', // This is to make sure images smaller than the ProgressiveImage size will cover
})(ConnectedImage);

const CampusImageSizer = styled({
  aspectRatio: 1,
  height: '100%',
  alignSelf: 'stretch',
})(View);

const StyledCard = styled(({ theme }) => ({
  width: CARD_WIDTH,
  height: theme.sizing.baseUnit * 6,
  marginHorizontal: theme.sizing.baseUnit / 4,
}))(Card);

const CampusCard = enhance(
  ({ title, description, distance, images, isLoading, ...otherProps }) => (
    <StyledCard isLoading={isLoading} inHorizontalList {...otherProps}>
      <HorizontalLayout>
        {images ? (
          <CampusImageSizer>
            <CampusImage source={images} />
          </CampusImageSizer>
        ) : null}
        <RightColumn>
          <HorizontalTextLayout>
            <H5>{title}</H5>
            <H6>
              {Math.round(distance)}
              mi
            </H6>
          </HorizontalTextLayout>
          {description ? <H6>{description}</H6> : null}
        </RightColumn>
      </HorizontalLayout>
    </StyledCard>
  )
);

CampusCard.CARD_WIDTH = CARD_WIDTH;
CampusCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  images: PropTypes.any, // eslint-disable-line
  category: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default CampusCard;
