import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { Dimensions, View } from 'react-native';

import {
  Card,
  FlexedView,
  ProgressiveImage,
  SideBySideView,
  withIsLoading,
  styled,
  CardContent,
  H5,
  H6,
  BodyText,
  Paragraph,
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
}))(CardContent);

const LeftColumn = styled({
  alignSelf: 'stretch',
  overflow: 'hidden',
  height: '100%',
  aspectRatio: 1,
})(FlexedView);

const campusImage = {
  aspectRatio: 1,
  resizeMode: 'cover', // This is to make sure images smaller than the ProgressiveImage size will cover
};

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
          {images ? (
            <LeftColumn>
              <ProgressiveImage source={images} imageStyle={campusImage} />
            </LeftColumn>
          ) : null}
          <RightColumn>
            <HorizontalTextLayout>
              <H5>{title}</H5>
              <H6>
                {distance}
                mi
              </H6>
            </HorizontalTextLayout>
            {description ? (
              <Paragraph>
                <BodyText>{description}</BodyText>
              </Paragraph>
            ) : null}
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
