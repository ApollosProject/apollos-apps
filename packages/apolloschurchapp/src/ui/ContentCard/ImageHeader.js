import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { ImageSourceType } from 'apolloschurchapp/src/ui/ConnectedImage';
import { CardImage } from 'apolloschurchapp/src/ui/Card';
import { withTheme } from 'apolloschurchapp/src/ui/theme';

const styles = StyleSheet.create({
  square: {
    aspectRatio: 1,
  },
});

const ImageHeader = ({ coverImage, forceRatio, overlayColor }) => (
  <CardImage
    imageStyle={forceRatio ? styles.square : null}
    source={coverImage}
    overlayColor={overlayColor}
  />
);

ImageHeader.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  forceRatio: PropTypes.bool,
  overlayColor: PropTypes.string,
};

export default withTheme(({ theme, showOverlayColor }) => ({
  overlayColor: showOverlayColor ? theme.colors.primary : undefined,
}))(ImageHeader);
