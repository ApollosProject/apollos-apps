import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { pure, compose, withProps } from 'recompose';
import Color from 'color';

import styled from 'ui/styled';
import ConnectedImage from 'ui/ConnectedImage';

const Overlay = styled(StyleSheet.absoluteFillObject)(LinearGradient);

const getGradientValues = (overlayColor) => {
  const values = {
    colors: [
      `${Color(overlayColor)
        .fade(1)
        .string()}`,
      overlayColor,
    ],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    locations: [0.3, 1],
  };

  return values;
};

const Container = styled(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.colors.background.inactive,
}))(View);

const DefaultImageComponent = compose(
  styled({
    width: '100%',
    resizeMode: 'cover',
  }),
  withProps({ maintainAspectRatio: true })
)(ConnectedImage);

const GradientOverlayImage = pure(
  ({
    source: imageSource,
    overlayColor,
    ImageComponent: ComponentProp,
    isLoading,
    ...otherProps
  }) => {
    const Component = ComponentProp || DefaultImageComponent;
    return (
      <Container>
        {imageSource || isLoading ? (
          <Component
            source={imageSource}
            isLoading={isLoading}
            {...otherProps}
          />
        ) : null}
        {overlayColor ? (
          <Overlay
            colors={getGradientValues(overlayColor).colors}
            start={getGradientValues(overlayColor).start}
            end={getGradientValues(overlayColor).end}
            locations={getGradientValues(overlayColor).locations}
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
};

export default GradientOverlayImage;
