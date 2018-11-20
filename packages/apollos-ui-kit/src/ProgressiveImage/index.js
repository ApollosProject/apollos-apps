import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import { getIsLoading } from '../isLoading';
import styled from '../styled';
import ConnectedImage from '../ConnectedImage';

const Wrapper = styled(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.colors.background.inactive,
}))(View);

const NoImagePlaceholder = styled(({ theme }) => ({
  width: '100%',
  aspectRatio: 1,
  backgroundColor: theme.colors.background.inactive,
}))(View);

const styles = StyleSheet.create({
  imageStyles: {
    width: '100%',
    resizeMode: 'cover',
  },
});

class ProgressiveImage extends PureComponent {
  static propTypes = {
    source: ConnectedImage.propTypes.source,
    thumbnail: ConnectedImage.propTypes.source,
    thumbnailBlurRadius: PropTypes.number,
    imageStyle: PropTypes.any, // eslint-disable-line
    ...ConnectedImage.propTypes,
  };

  static defaultProps = {
    thumbnailBlurRadius: 2,
  };

  render() {
    const {
      source,
      thumbnail,
      thumbnailFadeDuration,
      imageFadeDuration,
      thumbnailBlurRadius,
      onLoadThumbnail,
      onLoadImage,
      imageStyle,
      style,
      isLoading,
      ...imageProps
    } = this.props;
    return (
      <Wrapper style={style}>
        {!source && !thumbnail && isLoading ? <NoImagePlaceholder /> : null}
        {thumbnail ? (
          <ConnectedImage
            {...imageProps}
            blurRadius={thumbnailBlurRadius}
            style={[styles.imageStyles, imageStyle]}
            source={thumbnail}
          />
        ) : null}
        {source || isLoading ? (
          <ConnectedImage
            {...imageProps}
            isLoading={isLoading}
            style={[styles.imageStyles, imageStyle]}
            source={source}
          />
        ) : null}
      </Wrapper>
    );
  }
}

const ProgressiveImageWithLoadingState = getIsLoading(ProgressiveImage);
ProgressiveImageWithLoadingState.propTypes = ProgressiveImage.propTypes;

export default ProgressiveImageWithLoadingState;
