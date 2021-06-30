import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import BackgroundView from '../BackgroundView';
import ConnectedImage, { ImageSourceType } from '../ConnectedImage';
import { withTheme } from '../theme';

const BlurredImage = withTheme(
  () => ({
    blurRadius: 80,
    style: {
      ...StyleSheet.absoluteFillObject,
    },
  }),
  'ui-kit.BackgroundImageBlur.BlurredImage'
)(ConnectedImage);

const BackgroundImageBlur = ({
  children,
  material = 'regular',
  ...imageProps
}) => (
  <BackgroundView style={StyleSheet.absoluteFill}>
    <BlurredImage {...imageProps} />
    <BackgroundView style={StyleSheet.absoluteFill} material={material} />
    {children}
  </BackgroundView>
);

BackgroundImageBlur.propTypes = {
  children: PropTypes.node,
  material: PropTypes.string,
  source: ImageSourceType,
};

export default BackgroundImageBlur;
