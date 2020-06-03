import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import CenteredView from '../../CenteredView';
import ConnectedImage, { ImageSourceType } from '../../ConnectedImage';
import styled from '../../styled';

const CenteredAvatar = styled(
  ({ orientation, size }) => ({
    aspectRatio: 1,
    borderRadius: 1000, // For simplicity we are just going to use a very large magic number 🙃🧙
    zIndex: 100,
    ...(orientation === 'landscape' // Avatar size is based on the smallest device dimension
      ? { height: `${size}%` }
      : { width: `${size}%` }),
  }),
  'ui-kit.AvatarList.UserAvatar'
)(ConnectedImage);

const RandomAvatar = styled(
  ({ orientation, size, getXYPositions }) => ({
    aspectRatio: 1,
    borderRadius: 1000, // For simplicity we are just going to use a very large magic number 🙃🧙
    position: 'absolute',
    ...getXYPositions(size),
    ...(orientation === 'landscape' // Avatar size is based on the smallest device dimension
      ? { height: `${size}%` }
      : { width: `${size}%` }),
  }),
  'ui-kit.AvatarList.RandomAvatar'
)(ConnectedImage);

class AvatarCloud extends PureComponent {
  static propTypes = {
    avatars: PropTypes.arrayOf(ImageSourceType).isRequired,
    maxAvatarSize: PropTypes.number, // a percentage represented as a whole number
    minAvatarSize: PropTypes.number, // a percentage represented as a whole number
    primaryAvatar: ImageSourceType, // The source to render a larger avatar at the center of the cloud
  };

  static defaultProps = {
    maxAvatarSize: 50,
    minAvatarSize: 10,
  };

  getOrientation = () => {
    if (Dimensions.get('window').width > Dimensions.get('window').height) {
      return 'landscape';
    }
    return 'portrait';
  };

  getRandomAvatarMaxSize() {
    return this.props.primaryAvatar
      ? this.props.maxAvatarSize - 10
      : this.props.maxAvatarSize;
  }

  getRandomPercentageSize() {
    return Math.floor(
      Math.random() *
        (this.getRandomAvatarMaxSize() - this.props.minAvatarSize + 1) +
        this.props.minAvatarSize
    );
  }

  getRandomXYPositions = (avatarSize) => {
    // positionBoundry represents the viewable space for a given Avatar based on its size.
    const positionBoundry = 100 - avatarSize;

    return {
      left: `${Math.round(Math.random() * positionBoundry)}%`,
      top: `${Math.round(Math.random() * positionBoundry)}%`,
    };
  };

  renderRandomAvatars() {
    return this.props.avatars.map((avatar, i) => (
      <RandomAvatar
        key={JSON.stringify(avatar + i)}
        size={this.getRandomPercentageSize()}
        orientation={this.getOrientation()}
        source={avatar}
        getXYPositions={this.getRandomXYPositions}
      />
    ));
  }

  render() {
    const {
      avatars,
      maxAvatarSize,
      minAvatarSize,
      primaryAvatar,
      ...props
    } = this.props;
    return (
      <CenteredView {...props}>
        {primaryAvatar ? (
          <CenteredAvatar
            orientation={this.getOrientation()}
            size={maxAvatarSize}
            source={primaryAvatar}
          />
        ) : null}
        {this.renderRandomAvatars()}
      </CenteredView>
    );
  }
}

export default AvatarCloud;
