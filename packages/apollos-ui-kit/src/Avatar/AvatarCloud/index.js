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
  containerSize = 100,
  centerMargin = 0,
  avatarWidth,
}) {
  // Math time!!! Get ready.

  // The inital angle, each avatar is placed around a circle starting at this angle.
  const initialAngle = Math.PI * seed * 2;
  // How much we travel to place each avatar. The goal is to only travel the circle once.
  const angleIncrement = (Math.PI * 2) / count;
  // This is thet angle we are placing this specific avatar at.
  const finalAngle = initialAngle + angleIncrement * index;
  // A fun function that produces a positive random number different from the seed or the index (but a function of the seed and index)
  // We'll use this to adjust the distance to the center.
  const indexAdjustedRandom = Math.abs(Math.sin(seed + index));
  // Distance to the center of the avatar.
  const avatarCenterWidth = (avatarWidth * 100) / 2;

  // The maximum width from the center should be half the container size minus the width of the avatars.
  const maxRadius = containerSize / 2 - avatarCenterWidth;

  // Now we get our width from our random number, and plot it along a exponential function to weight it towards lower values.
  const weightedWidth = (maxRadius * indexAdjustedRandom) ** 2 / maxRadius;

  // Now we ensure that size isn't inside the center margin.
  const boundedSize = Math.max(
    centerMargin, // We don't want to be bunched around the center.
    weightedWidth // Now need to add an actual randomized distance.
  );

  // Polish up on your trig, now we convert our angle and radius to an X and Y coordinate.
  // Note that we have to add in half the container size to adjust our origin from 0,0 to 50,50 (or containerWidth, containerWidth)
  // We also subtract the distance to the avatar to center because the "placement point" of the avatars is the top left corner.
  const x =
    boundedSize * Math.cos(finalAngle) + containerSize / 2 - avatarCenterWidth;
  const y =
    boundedSize * Math.sin(finalAngle) + containerSize / 2 - avatarCenterWidth;

  return { x, y };
}

class AvatarCloud extends PureComponent {
  static propTypes = {
    avatars: PropTypes.arrayOf(ImageSourceType).isRequired,
    blur: PropTypes.bool, // Weather or not to blur the "background" avatars. Defaults to true,
    radial: PropTypes.bool,
    isLoading: PropTypes.bool,
    maxAvatarWidth: PropTypes.number, // A percentage represented as a whole number (e.g. `0.5`) but pixel values will work too.
    minAvatarWidth: PropTypes.number, // A percentage represented as a whole number (e.g. `0.1`). It is not recommeded to go smaller than 0.1 (default)
    primaryAvatar: ImageSourceType, // The source to render a larger avatar at the center of the cloud
    seed: PropTypes.number, // The result of a call to Math.random(), useful for generating the same scene every time.
  };

  static defaultProps = {
    blur: true,
    maxAvatarWidth: 0.5,
    minAvatarWidth: 0.1,
  };

  constructor(props) {
    super(props);

    this.randomSeeds = {};
    this.defaultSeed = Math.random();
  }

  get seed() {
    return this.props.seed || this.defaultSeed;
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
    return this.props.avatars.map((avatar, i) => {
      const randomNumberInRange =
        this.getRandomPositionValue(i) *
          (this.getRandomAvatarMaxWidth() - this.props.minAvatarWidth) +
        this.props.minAvatarWidth;
      return Math.floor(randomNumberInRange * 10) / 10;
    });
  }

  getRandomXYPositions({ i, size }) {
    // positionBoundry represents the viewable space for a given Avatar based on its size.
    const positionBoundry = 1 - size;
    const xyPositions = {
      left: this.getAvatarPercentageWidth(
        this.getRandomPositionValue(`${i}-x`) * positionBoundry
      ),
      top: this.getAvatarPercentageWidth(
        this.getRandomPositionValue(`${i}-y`) * positionBoundry
      ),
    };

    return xyPositions;
  }

  getRadialXYPositions({ i, count, size }) {
    const centerMargin = this.props.primaryAvatar
      ? (this.props.maxAvatarWidth * 100) / 2
      : 0;
    const { x, y } = getCircularAvatarPos({
      index: i,
      seed: this.seed,
      count,
      centerMargin,
      avatarWidth: size,
      containerSize: 100, // 100 since we are dealing with percentages.
    });
    return {
      left: `${x}%`,
      top: `${y}%`,
    };
  }

  get radial() {
    // If the radial prop is passed, respect it.
    if (this.props.radial != null) {
      return this.props.radial;
    }
    // Otherwise, use radial if we have a primary avatar.
    return !!this.props.primaryAvatar;
  }

  renderRandomAvatars = () => {
    const positionFunction = this.radial
      ? this.getRadialXYPositions.bind(this)
      : this.getRandomXYPositions.bind(this);

    return this.getRandomAvatarSizes().map((size, i, sizes) => (
      <BlurWrapper
        avatarWidth={this.getAvatarPercentageWidth(size)}
        getXYPositions={positionFunction({
          count: sizes.length,
          i,
          size,
        })}
        key={`${
          typeof this.props.avatars[i] === 'string'
            ? this.props.avatars[i]
            : this.props.avatars[i]?.uri
        }${this.props.avatars[i].id ? this.props.avatars[i].id : i}`}
        order={Math.floor(Math.abs(Math.sin(i * this.seed)) * 10)} // order = zIndex == higher index === "closer two the viewer/higher layer"
      >
        <RandomAvatar
          source={this.props.avatars[i]}
          isLoading={this.props.isLoading}
          blurRadius={this.props.blur ? sizes.length - i : 0}
        />
      </BlurWrapper>
    ));
  };

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
        {this.renderRandomAvatars()}
      </CenteredView>
    );
  }
}

export default AvatarCloud;
