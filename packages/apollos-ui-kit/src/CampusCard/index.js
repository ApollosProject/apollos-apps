import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Card, { CardContent } from '../Card';
import ConnectedImage from '../ConnectedImage';
import SideBySideView from '../SideBySideView';
import styled from '../styled';
import { H5, H6 } from '../typography';

const HorizontalLayout = styled(({ theme }) => ({
  alignItems: 'center',
  height: theme.sizing.baseUnit * 6,
}))(SideBySideView);

const Header = styled(({ theme }) => ({
  height: theme.helpers.verticalRhythm(0.875),
}))(SideBySideView);

const FlexedCardContent = styled({
  flex: 1,
})(CardContent);

const CampusImage = styled({
  aspectRatio: 1,
  height: '100%',
  resizeMode: 'cover',
})(ConnectedImage);

const CampusCard = memo(
  ({ title, description, distance, images, ...otherProps }) => (
    <Card
      isLoading={otherProps.isLoading || false}
      inHorizontalList
      {...otherProps}
    >
      <HorizontalLayout>
        {images ? <CampusImage source={images} /> : null}
        <FlexedCardContent>
          <Header>
            <H5>{title}</H5>
            {distance != null ? (
              <H6>
                {Math.round(distance)}
                mi
              </H6>
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
  images: PropTypes.any, // eslint-disable-line
  category: PropTypes.string,
  distance: PropTypes.number,
};

CampusCard.displayName = 'CampusCard';

export default CampusCard;
