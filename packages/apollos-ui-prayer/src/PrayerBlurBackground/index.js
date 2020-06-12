import React from 'react';
import { StyleSheet } from 'react-native';
import { ConnectedImage, BackgroundView, styled } from '@apollosproject/ui-kit';

const StyledImage = styled({
  ...StyleSheet.absoluteFillObject,
  opacity: 0.25,
})(ConnectedImage);

const Background = (props) => (
  <BackgroundView style={StyleSheet.absoluteFill}>
    <StyledImage {...props} blurRadius={250} />
  </BackgroundView>
);

export default Background;
