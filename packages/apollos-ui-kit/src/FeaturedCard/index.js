import React from 'react';
import PropTypes from 'prop-types';

import styled from '../styled';
import Card, { CardImage, CardContent } from '../Card';
import { ImageSourceType } from '../ConnectedImage';
import { H2, BodyText } from '../typography';

const Image = styled({
  aspectRatio: 1,
})(CardImage);

const Content = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 2, // TODO: refactor CardContent to have this be the default
}))(CardContent);

const Description = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit,
}))(BodyText);

const MediaCard = ({ image, title, description }) => (
  <Card>
    <Image source={image} />

    <Content>
      <H2 numberOfLines={description ? 3 : 4}>{title}</H2>
      {description ? (
        <Description numberOfLines={2}>{description}</Description>
      ) : null}
    </Content>
  </Card>
);

MediaCard.propTypes = {
  image: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

MediaCard.displayName = 'MediaCard';

export default MediaCard;
