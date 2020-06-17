import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import BackgroundView from '../BackgroundView';
import ConnectedImage, { ImageSourceType } from '../ConnectedImage';
import { withTheme } from '../theme';

const BlurredImage = withTheme(
  () => ({
    blurRadius: 250,
    style: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.5,
    },
  }),
  'ui-kit.BackgroundImageBlur.BlurredImage'
)(ConnectedImage);

const BackgroundImageBlur = ({ children, imageProps }) => (
  <BackgroundView style={StyleSheet.absoluteFill}>
    <BlurredImage {...imageProps} />
    {children}
  </BackgroundView>
);

BackgroundImageBlur.propTypes = {
  children: PropTypes.node,
  ...ImageSourceType,
};

export default BackgroundImageBlur;
