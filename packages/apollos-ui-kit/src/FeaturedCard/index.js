import React from 'react';
import PropTypes from 'prop-types';

import styled from '../styled';
import Card, { CardImage, CardContent } from '../Card';
import { ImageSourceType } from '../ConnectedImage';
import { H2 } from '../typography';

const Image = styled({
  aspectRatio: 1,
})(CardImage);

const Content = styled({})(CardContent);

const MediaCard = ({ title, image }) => (
  <Card>
    <Image source={image} />

    <Content>
      <H2>{title}</H2>
    </Content>
  </Card>
);

MediaCard.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
};

MediaCard.displayName = 'MediaCard';

export default MediaCard;
