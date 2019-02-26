import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { compose, pure } from 'recompose';

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

const enhance = compose(
  withIsLoading,
  pure
);

const HorizontalLayout = styled({
  alignItems: 'center',
  minHeight: 110, // kind of the best middle ground for various title lengths.
})(SideBySideView);

const HorizontalTextLayout = styled(({ theme }) => ({
  height: theme.helpers.verticalRhythm(0.875),
}))(SideBySideView);

const RightColumn = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 0.75,
}))(CardContent);

const LeftColumn = styled({
  alignSelf: 'stretch',
  backgroundColor: 'red',
  overflow: 'hidden',
  height: '100%',
  aspectRatio: 1,
})(FlexedView);

const CampusCard = enhance(
  ({
    title,
    description,
    distance,
    images,
    thumbnailImage,
    category,
    isLoading,
    onPressItem,
    ...otherProps
  }) => (
    <TouchableWithoutFeedback onPress={() => onPressItem()}>
      <Card isLoading={isLoading} inHorizontalList {...otherProps}>
        <HorizontalLayout>
          {images ? (
            <LeftColumn>
              <ProgressiveImage
                source={images}
                imageStyle={{
                  aspectRatio: 1,
                  resizeMode: 'cover',
                }}
              />
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
    </TouchableWithoutFeedback>
  )
);

CampusCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  images: PropTypes.source,
  category: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default CampusCard;
