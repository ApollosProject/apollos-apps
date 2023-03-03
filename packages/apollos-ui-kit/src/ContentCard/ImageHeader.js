import React from 'react';
import PropTypes from 'prop-types';
import { ImageSourceType } from '../ConnectedImage';
import { CardImage } from '../Card';
import { withTheme } from '../theme';

const ImageHeader = ({ coverImage, forceRatio, overlayColor }) => (
  <CardImage
    style={forceRatio ? { aspectRatio: forceRatio } : null}
    imageStyle={forceRatio ? { aspectRatio: forceRatio } : null}
    source={coverImage}
    overlayColor={overlayColor}
  />
);

ImageHeader.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  forceRatio: PropTypes.number,
  overlayColor: PropTypes.string,
};

export default withTheme(({ theme, showOverlayColor }) => ({
  overlayColor: showOverlayColor ? theme.colors.primary : undefined,
}))(ImageHeader);
