import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CenteredView from '../../CenteredView';
import ConnectedImage, { ImageSourceType } from '../../ConnectedImage';
import styled from '../../styled';

const CenteredAvatar = styled(
  ({ size }) => ({
    aspectRatio: 1,
    borderRadius: 1000, // For simplicity we are just going to use a very large magic number 🙃🧙
    width: size,
    zIndex: 100,
  }),
  'ui-kit.AvatarList.UserAvatar'
)(ConnectedImage);

const RandomAvatar = styled(
  ({ order, size, getXYPositions }) => ({
    aspectRatio: 1,
    borderRadius: 1000, // For simplicity we are just going to use a very large magic number 🙃🧙
    position: 'absolute',
    width: size,
    zIndex: order,
    ...getXYPositions,
  }),
  'ui-kit.AvatarList.RandomAvatar'
)(ConnectedImage);

class AvatarCloud extends PureComponent {
  static propTypes = {
    avatars: PropTypes.arrayOf(ImageSourceType).isRequired,
    maxAvatarWidth: PropTypes.number, // A percentage represented as a whole number (e.g. `0.5`) but pixel values will work too.
    minAvatarWidth: PropTypes.number, // A percentage represented as a whole number (e.g. `0.1`)
    primaryAvatar: ImageSourceType, // The source to render a larger avatar at the center of the cloud
  };

  static defaultProps = {
    maxAvatarWidth: 0.5,
    minAvatarWidth: 0.1,
  };

  getAvatarPercentageWidth = (width) => `${width * 100}%`;

  getRandomAvatarMaxSize() {
    return this.props.primaryAvatar
      ? /* we need some way to differentiate the largest possible `RandomAvatar`s from the
         * `primaryAvatar` so we subtract by a magic number that looks nice 🧙‍♂️ */
        this.props.maxAvatarWidth - 0.1
      : this.props.maxAvatarWidth;
  }

  getRandomAvatarSizes() {
    const sizes = this.props.avatars.map(() => {
      const randomNumberInRange =
        Math.random() *
          (this.getRandomAvatarMaxSize() - this.props.minAvatarWidth) +
        this.props.minAvatarWidth;

      return Math.floor(randomNumberInRange * 10 + 1) / 10;
    });

    return sizes.sort((a, b) => a - b); // sort by decending order e.g. 1, 2, 3, 4
  }

  getRandomXYPositions = (avatarSize) => {
    // positionBoundry represents the viewable space for a given Avatar based on its size.
    const positionBoundry = 1 - avatarSize;
    return {
      left: this.getAvatarPercentageWidth(Math.random() * positionBoundry),
      top: this.getAvatarPercentageWidth(Math.random() * positionBoundry),
    };
  };

  renderRandomAvatars() {
    return this.getRandomAvatarSizes().map((size, i) => (
      <RandomAvatar
        key={i * size} // eslint-disable-line react/no-array-index-key
        size={this.getAvatarPercentageWidth(size)}
        order={i}
        source={this.props.avatars[i]}
        getXYPositions={this.getRandomXYPositions(size)}
      />
    ));
  }

  render() {
    const {
      avatars,
      maxAvatarWidth,
      minAvatarWidth,
      primaryAvatar,
      ...props
    } = this.props;
    return (
      <CenteredView {...props}>
        {primaryAvatar ? (
          <CenteredAvatar
            size={this.getAvatarPercentageWidth(maxAvatarWidth)}
            source={primaryAvatar}
          />
        ) : null}
        {this.renderRandomAvatars()}
      </CenteredView>
    );
  }
}

export default AvatarCloud;
