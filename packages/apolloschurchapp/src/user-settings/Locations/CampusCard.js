import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { Dimensions, View } from 'react-native';

import {
  Card,
  FlexedView,
  ConnectedImage,
  SideBySideView,
  withIsLoading,
  styled,
  CardContent,
  H5,
  H6,
} from '@apollosproject/ui-kit';

const { width } = Dimensions.get('window');

export const CARD_WIDTH = width * 0.94;

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

const CardContainer = styled({
  width: CARD_WIDTH,
})(View);

const CampusCard = enhance(
  ({
    title,
    description,
    distance,
    images,
    thumbnailImage,
    category,
    isLoading,
    ...otherProps
  }) => (
    <CardContainer>
      <Card isLoading={isLoading} inHorizontalList {...otherProps}>
        <HorizontalLayout>
          {images ? <CampusImage source={images} /> : null}
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
      </Card>
    </CardContainer>
  )
);

CampusCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  images: PropTypes.source,
  category: PropTypes.string,
  isLoading: PropTypes.bool,
  key: PropTypes.number,
};

export default CampusCard;
