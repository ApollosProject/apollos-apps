import React, { useState } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';
import { every } from 'lodash';

import styled from '../styled';

export const ImageSourceType = PropTypes.oneOfType([
  PropTypes.shape({
    uri: PropTypes.string,
    label: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  PropTypes.string,
]);

export const sizeCache = {};

export const getCacheKey = (source) => {
  if (!source) return undefined;
  if (source.url) return source.url;
  if (source.uri) return source.uri;
  if (typeof source === 'string') return source;
  return undefined;
};

export const getCachedSources = (_sources = []) => {
  let sources = _sources;
  if (!Array.isArray(sources)) sources = [sources];
  sources = sources.map((source) => {
    if (typeof source === 'string') return { url: source };
    return source;
  });

  return sources.map((source) => ({
    uri: (source?.url || '').replace(/^http:\/\/|^\/\//i, 'https://'),
    cache: 'force-cache',
    ...source,
    ...(sizeCache[getCacheKey(source)] || {}),
  }));
};

export const updateCache = ({ width, height, url }) => {
  const cacheKey = getCacheKey(url);
  sizeCache[cacheKey] = {
    ...(sizeCache[cacheKey] || {}),
    width,
    height,
  };
};

const ConnectedImage = ({
  source,
  ImageComponent = Animated.Image,
  maintainAspectRatio = false,
  onLoad,
  style,
  minAspectRatio,
  maxAspectRatio,
  forceRatio,
  fadeDuration = 250,
  ...imageProps
}) => {
  const cachedSource = getCachedSources(source);
  const imageInCache = every(
    cachedSource,
    (image) => image.width && image.height
  );

  // Aspect Ratio Calculations
  const [[width, height], setImageSize] = useState([
    cachedSource.width,
    cachedSource.height,
  ]);
  const aspectRatioStyle = {};

  if (maintainAspectRatio) {
    aspectRatioStyle.aspectRatio = width && height ? width / height : 1;

    if (minAspectRatio || maxAspectRatio) {
      const calcMaxAspectRatio = maxAspectRatio || aspectRatioStyle.aspectRatio;
      const calcMinAspectRatio = minAspectRatio || 0;

      aspectRatioStyle.aspectRatio = Math.max(
        Math.min(calcMaxAspectRatio, aspectRatioStyle.aspectRatio),
        calcMinAspectRatio
      );
    }
  }

  if (forceRatio) {
    aspectRatioStyle.aspectRatio = forceRatio;
  }

  const handleOnLoad = (e) => {
    if (onLoad) onLoad(e);
    if (!imageInCache) {
      const {
        nativeEvent: { source: loadedSource },
      } = e;
      updateCache(loadedSource);
      setImageSize([loadedSource.newWidth, loadedSource.newHeight]);
    }
  };

  return (
    <ImageComponent
      {...imageProps}
      source={cachedSource || source}
      onLoad={handleOnLoad}
      fadeDuration={fadeDuration}
      style={[aspectRatioStyle, style]}
    />
  );
};

const aspectRatioPropValidator = (props, propName, componentName) => {
  if (props[propName] === undefined) return;

  let errorMessage = '';

  if (typeof props[propName] !== 'number') {
    errorMessage = `Invalid prop \`${propName}\` of value \`${typeof props[
      propName
    ]}\` supplied to \`${componentName}\` expected type of number`;
  }

  if (!props.maintainAspectRatio) {
    errorMessage += ` Prop maintainAspectRatio is required for use with ${propName}`;
  }

  if (typeof props[propName] !== 'number' || !props.maintainAspectRatio) {
    return new Error(errorMessage); // eslint-disable-line consistent-return
  }
};

ConnectedImage.propTypes = {
  source: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  ImageComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  maintainAspectRatio: PropTypes.bool,
  onLoad: PropTypes.func,
  style: PropTypes.any, // eslint-disable-line
  minAspectRatio: aspectRatioPropValidator,
  maxAspectRatio: aspectRatioPropValidator,
};

const enhanced = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.background.inactive,
  }),
  'ui-kit.ConnectedImage.enhanced'
)(ConnectedImage);

enhanced.propTypes = ConnectedImage.propTypes;

export default enhanced;
