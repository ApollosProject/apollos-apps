import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import CenteredView from '../../CenteredView';
import ConnectedImage, { ImageSourceType } from '../../ConnectedImage';
import styled from '../../styled';

const BlurWrapper = styled(
  ({ avatarWidth, order, getXYPositions }) => ({
    aspectRatio: 1,
    position: 'absolute',
    width: avatarWidth,
    zIndex: order,
    ...getXYPositions,
  }),
  'ui-kit.Avatar.AvatarCloud.BlurWrapper'
)(View);

const CenteredAvatar = styled(
  ({ avatarWidth }) => ({
    aspectRatio: 1,
    borderRadius: 1000, // For simplicity we are just going to use a very large magic number 🙃🧙
    width: avatarWidth,
    zIndex: 100,
  }),
  'ui-kit.Avatar.AvatarCloud.CenteredAvatar'
)(ConnectedImage);

const RandomAvatar = styled(
  {
    borderRadius: 1000, // For simplicity we are just going to use a very large magic number 🙃🧙
    aspectRatio: 1,
    width: '100%',
  },
  'ui-kit.Avatar.AvatarCloud.RandomAvatar'
)(ConnectedImage);

function getCircularAvatarPos({
  index,
  seed,
  count,
  containerWidth = 100,
  containerHeight = 100,
  centerMargin = 0,
}) {
  const initialAngle = Math.PI * seed * 2;
  const angleIncrement = (Math.PI * 2) / count;
  const finalAngle = initialAngle + angleIncrement * index;
  const x =
    Math.max(seed * containerWidth, centerMargin) * Math.cos(finalAngle) +
    containerWidth / 2;
  const y =
    Math.max(seed * containerHeight, centerMargin) * Math.sin(finalAngle) +
    containerHeight / 2;

  console.log({
    initialAngle,
    angleIncrement,
    finalAngle,
    x,
    y,
    count,
    seed,
    index,
  });

  return { x, y };
}

class AvatarCloud extends PureComponent {
  static propTypes = {
    avatars: PropTypes.arrayOf(ImageSourceType).isRequired,
    blur: PropTypes.bool, // Weather or not to blur the "background" avatars. Defaults to true,
    isLoading: PropTypes.bool,
    maxAvatarWidth: PropTypes.number, // A percentage represented as a whole number (e.g. `0.5`) but pixel values will work too.
    minAvatarWidth: PropTypes.number, // A percentage represented as a whole number (e.g. `0.1`). It is not recommeded to go smaller than 0.1 (default)
    primaryAvatar: ImageSourceType, // The source to render a larger avatar at the center of the cloud
  };

  static defaultProps = {
    blur: true,
    maxAvatarWidth: 0.5,
    minAvatarWidth: 0.1,
  };

  constructor() {
    super();

    this.randomSeeds = {};
    this.seed = Math.random();
  }

  getAvatarPercentageWidth = (width) => `${width * 100}%`;

  getRandomAvatarMaxWidth() {
    return this.props.primaryAvatar
      ? /* we need some way to differentiate the largest possible `RandomAvatar`s from the
         * `primaryAvatar` so we subtract by a magic number that looks nice 🧙‍♂️ */
        this.props.maxAvatarWidth - 0.1
      : this.props.maxAvatarWidth;
  }

  getRandomPositionValue(seed) {
    if (!this.randomSeeds[seed]) this.randomSeeds[seed] = Math.random();
    return this.randomSeeds[seed];
  }

  getRandomAvatarSizes() {
    const sizes = this.props.avatars.map((avatar, i) => {
      const randomNumberInRange =
        this.getRandomPositionValue(i) *
          (this.getRandomAvatarMaxWidth() - this.props.minAvatarWidth) +
        this.props.minAvatarWidth;
      return Math.floor(randomNumberInRange * 10) / 10;
    });

    return sizes.sort((a, b) => a - b); // sort by decending order e.g. 1, 2, 3, 4
  }

  getRandomXYPositions(avatarSize, index) {
    // positionBoundry represents the viewable space for a given Avatar based on its size.
    const positionBoundry = 1 - avatarSize;
    const xyPositions = {
      left: this.getAvatarPercentageWidth(
        this.getRandomPositionValue(`${index}-x`) * positionBoundry
      ),
      top: this.getAvatarPercentageWidth(
        this.getRandomPositionValue(`${index}-y`) * positionBoundry
      ),
    };

    console.log(xyPositions);

    return xyPositions;
  }

  getRadialXYPositions({ i, count }) {
    const centerMargin = this.props.primaryAvatar
      ? this.props.maxAvatarSize
      : 0;
    const { x, y } = getCircularAvatarPos({
      index: i,
      seed: this.seed,
      count,
      centerMargin,
    });
    console.log({
      left: `${x}%`,
      top: `${y}%`,
    });
    return {
      left: `${x}%`,
      top: `${y}%`,
    };
  }

  renderRandomAvatars() {
    return this.getRandomAvatarSizes().map((size, i, sizes) => (
      <BlurWrapper
        avatarWidth={this.getAvatarPercentageWidth(size)}
        getXYPositions={this.getRandomXYPositions(size, i)}
        key={`${
          typeof this.props.avatars[i] === 'string'
            ? this.props.avatars[i]
            : this.props.avatars[i]?.uri
        }${this.props.avatars[i].id ? this.props.avatars[i].id : i}`}
        order={i} // order = zIndex == higher index === "closer two the viewer/higher layer"
      >
        <RandomAvatar
          source={this.props.avatars[i]}
          isLoading={this.props.isLoading}
          blurRadius={this.props.blur ? sizes.length - i : 0}
        />
      </BlurWrapper>
    ));
  }

  renderRadialRandomAvatars() {
    return this.getRandomAvatarSizes().map((size, i, sizes) => (
      <BlurWrapper
        avatarWidth={this.getAvatarPercentageWidth(size)}
        getXYPositions={this.getRadialXYPositions({ count: sizes.length, i })}
        key={`${
          typeof this.props.avatars[i] === 'string'
            ? this.props.avatars[i]
            : this.props.avatars[i]?.uri
        }${this.props.avatars[i].id ? this.props.avatars[i].id : i}`}
        order={i} // order = zIndex == higher index === "closer two the viewer/higher layer"
      >
        <RandomAvatar
          source={this.props.avatars[i]}
          isLoading={this.props.isLoading}
          blurRadius={this.props.blur ? sizes.length - i : 0}
        />
      </BlurWrapper>
    ));
  }

  render() {
    const {
      avatars,
      blur,
      isLoading,
      maxAvatarWidth,
      minAvatarWidth,
      primaryAvatar,
      radial,
      ...props
    } = this.props;
    return (
      <CenteredView {...props}>
        {isLoading || primaryAvatar ? (
          <CenteredAvatar
            avatarWidth={this.getAvatarPercentageWidth(maxAvatarWidth)}
            source={primaryAvatar}
            isLoading={isLoading}
          />
        ) : null}
        {radial ? this.renderRadialRandomAvatars() : this.renderRandomAvatars()}
      </CenteredView>
    );
  }
}

export default AvatarCloud;
