import React from 'react';
import { compose, pure } from 'recompose';
import PropTypes from 'prop-types';

import GradientOverlayImage from 'ui/GradientOverlayImage';

const enhance = compose(pure);

const ImageHeader = enhance(({ images, thumbnail, imageOverlayColor }) => (
  <GradientOverlayImage
    source={images}
    thumbnail={thumbnail}
    overlayColor={imageOverlayColor}
  />
));

ImageHeader.propTypes = {
  images: PropTypes.any, // eslint-disable-line
  thumbnail: PropTypes.any, // eslint-disable-line
  imageOverlayColor: PropTypes.string,
};

export default ImageHeader;
