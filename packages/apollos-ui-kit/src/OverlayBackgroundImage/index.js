import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Dimensions } from 'react-native';

import {
  GradientOverlayImage,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

const DeviceWindow = Dimensions.get('window');

const StyledGradientOverlayImage = styled(
  {
    backgroundColor: 'red',
    ...StyleSheet.absoluteFillObject,
  },
  'ui-kit.OverlayBackgroundImage.StyledGradientOverlayImage'
)(GradientOverlayImage);

const Image = withTheme(
  ({ theme, ...ownProps }) => ({
    overlayColor: theme.colors.primary,
    overlayType: 'featured',
    ...ownProps, // allown ownProps to override defaults above
  }),
  'ui-kit.OverlayBackgroundImage.Image'
)(StyledGradientOverlayImage);

const ImageContainer = styled(
  {
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',

    // the following values were determined by the precise & scientific
    // method of guess and check.
    height: '20%',
    left: '40%',
    right: '40%',
  },
  'ui-kit.OverlayBackgroundImage.ImageContainer'
)(View);

const ClippingMask = styled(
  ({ rounded, containerWidth }) => ({
    overflow: 'hidden',
    position: 'absolute',

    // the following values were determined by the precise & scientific
    // method of guess and check.
    borderRadius: rounded ? containerWidth * 4 : null,
    top: '-400%',
    left: '-200%',
    right: '-200%',
    bottom: 0,
  }),
  'ui-kit.OverlayBackgroundImage.ClippingMask'
)(View);

const SizingContainer = styled(
  {
    width: '100%',
    aspectRatio: 1,
  },
  'ui-kit.OverlayBackgroundImage.SizingContainer'
)(View);

class OverlayBackgroundImage extends Component {
  static propTypes = {
    rounded: PropTypes.bool,
    style: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    rounded: true,
  };

  state = {
    width: DeviceWindow.width,
  };

  handleLayout = ({ nativeEvent: { layout: { width } = {} } = {} }) =>
    this.setState({ width });

  render() {
    const { style, rounded, ...props } = this.props;
    return (
      <SizingContainer style={style} onLayout={this.handleLayout}>
        <ClippingMask rounded={rounded} containerWidth={this.state.width}>
          <ImageContainer>
            <Image imageStyle={StyleSheet.absoluteFill} {...props} />
          </ImageContainer>
        </ClippingMask>
      </SizingContainer>
    );
  }
}

export default OverlayBackgroundImage;
