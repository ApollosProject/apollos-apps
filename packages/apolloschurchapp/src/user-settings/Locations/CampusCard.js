import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { Dimensions, View } from 'react-native';

import {
  Card,
  ConnectedImage,
  SideBySideView,
  withIsLoading,
  styled,
  CardContent,
  H5,
  H6,
} from '@apollosproject/ui-kit';

const { width } = Dimensions.get('window');

export const CARD_WIDTH = width - 24; // todo: remove magic number. `theme.sizing.baseUnit * 1.5`

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

const CardContainer = styled(({ theme }) => ({
  width: CARD_WIDTH,
  height: theme.sizing.baseUnit * 6,
}))(View);

const StyledCard = styled(({ theme }) => ({
  marginHorizontal: 0,
  marginRight: theme.sizing.baseUnit / 2,
}))(Card);

const CampusCard = enhance(
  ({ title, description, distance, images, isLoading, ...otherProps }) => (
    <CardContainer>
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
    </CardContainer>
  )
);

CampusCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  images: PropTypes.any, // eslint-disable-line
  category: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default CampusCard;
