import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import styled from '../styled';
import withTheme from '../theme/withTheme';
import ConnectedImage from '../ConnectedImage';

const Overlay = styled(StyleSheet.absoluteFillObject)(LinearGradient);

const ThemedOverlay = withTheme(
  ({ theme: { overlays }, overlayColor, overlayType }) =>
    overlays[overlayType]({ overlayColor }),
  'ui-kit.GradientOverlayImage.ThemedOverlay'
)(Overlay);

const Container = styled(
  ({ theme }) => ({
    width: '100%',
    overflow: 'hidden',
    backgroundColor: theme.colors.background.inactive,
  }),
  'ui-kit.GradientOverlayImage.Container'
)(View);

const DefaultImageComponent = styled(
  ({ resizeMode = 'cover' }) => ({
    width: '100%',
    resizeMode,
  }),
  'ui-kit.GradientOverlayImage.DefaultImageComponent'
)(ConnectedImage);

const NoImagePlaceholder = styled(
  ({ theme, forceRatio }) => ({
    width: '100%',
    aspectRatio: forceRatio || 1,
    backgroundColor: theme.colors.background.inactive,
  }),
  'ui-kit.GradientOverlayImage.NoImagePlaceholder'
)(View);

const GradientOverlayImage = pure(
  ({
    source: imageSource,
    overlayColor,
    overlayType,
    ImageComponent: ComponentProp,
    isLoading,
    style,
    imageStyle,
    resizeMode,
    forceRatio,
    ...otherProps
  }) => {
    const Component = ComponentProp || DefaultImageComponent;

    return (
      <Container style={style}>
        {imageSource || isLoading ? (
          <Component
            source={imageSource}
            isLoading={isLoading}
            resizeMode={resizeMode}
            style={imageStyle}
            forceRatio={forceRatio}
            {...otherProps}
          />
        ) : (
          <NoImagePlaceholder style={imageStyle} forceRatio={forceRatio} />
        )}
        {overlayColor ? (
          <ThemedOverlay
            overlayType={overlayType}
            overlayColor={overlayColor}
          />
        ) : null}
      </Container>
    );
  }
);

const source = PropTypes.oneOfType([
  PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string,
      label: PropTypes.string,
      width: PropTypes.number,
      height: PropTypes.number,
    })
  ),
  PropTypes.string,
]);

GradientOverlayImage.propTypes = {
  source,
  overlayColor: PropTypes.string,
  ImageComponent: PropTypes.func,
  maintainAspectRatio: PropTypes.bool,
};

GradientOverlayImage.defaultProps = {
  maintainAspectRatio: true,
  overlayType: 'default',
};

export default GradientOverlayImage;
