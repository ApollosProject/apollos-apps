import React from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback } from 'react-native';
import { compose, pure } from 'recompose';

import Card, {
  FlexedView,
  Thumbnail,
  SideBySideView,
  withIsLoading,
  styled,
  CardContent,
  H5,
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

const LeftColumn = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 0.75,
  backgroundColor: 'purple',
}))(CardContent);

const RightColumn = styled({
  alignSelf: 'stretch',
  // height: '100%',
  // aspectRatio: 1,
})(FlexedView);

const CampusCard = enhance(
  ({
    title,
    description,
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
          <LeftColumn>
            <H5>{title}</H5>
            {description ? (
              <Paragraph>
                <BodyText>{description}</BodyText>
              </Paragraph>
            ) : null}
          </LeftColumn>
          {images ? (
            <RightColumn>
              <Thumbnail source={images} />
            </RightColumn>
          ) : null}
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

export { CampusCard };
