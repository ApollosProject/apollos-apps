import React from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import CenteredView from '../../CenteredView';
import ConnectedImage, { ImageSourceType } from '../../ConnectedImage';
import styled from '../../styled';

const getRandomPercentageSize = ({ maxAvatarSize, minAvatarSize }) =>
  Math.floor(
    Math.random() * (maxAvatarSize - minAvatarSize + 1) + minAvatarSize
  );

const getRandomXYPosition = ({ imageHeight, imageWidth }) => {
  // `positionX` and `positionY` represent viewable space for a given image based on its size.
  const positionX = 100 - imageWidth;
  const positionY = 100 - imageHeight;

  return {
    left: `${Math.round(Math.random() * positionX)}%`,
    top: `${Math.round(Math.random() * positionY)}%`,
  };
};

const getRandomAvatarMaxSize = ({ maxAvatarSize, primaryAvatar }) =>
  primaryAvatar ? maxAvatarSize - 10 : maxAvatarSize;

const getOrientation = () => {
  if (Dimensions.get('window').width > Dimensions.get('window').height) {
    return 'landscape';
  }
  return 'portrait';
};

const CenteredAvatar = styled(({ size }) => {
  const orientation = getOrientation();
  return {
    aspectRatio: 1,
    borderRadius: 1000, // For simplicity we are just going to use a very large magic number 🙃🧙
    zIndex: 100,
    ...(orientation === 'landscape' // Avatar size is based on the smallest device dimension
      ? { height: `${size}%` }
      : { width: `${size}%` }),
  };
}, 'ui-kit.AvatarList.UserAvatar')(ConnectedImage);

const RandomAvatar = styled(({ size }) => {
  const orientation = getOrientation();
  return {
    aspectRatio: 1,
    borderRadius: 1000, // For simplicity we are just going to use a very large magic number 🙃🧙
    position: 'absolute',
    ...getRandomXYPosition({
      imageHeight: size,
      imageWidth: size,
    }),
    ...(orientation === 'landscape' // Avatar size is based on the smallest device dimension
      ? { height: `${size}%` }
      : { width: `${size}%` }),
  };
}, 'ui-kit.AvatarList.RandomAvatar')(ConnectedImage);

const renderRandomAvatars = ({
  avatars,
  maxAvatarSize,
  minAvatarSize,
  primaryAvatar,
}) =>
  avatars.map((avatar, i) => (
    <RandomAvatar
      key={JSON.stringify(avatar + i)}
      size={getRandomPercentageSize({
        maxAvatarSize: getRandomAvatarMaxSize({ maxAvatarSize, primaryAvatar }),
        minAvatarSize,
      })}
      source={avatar}
    />
  ));

const AvatarCloud = ({
  avatars,
  maxAvatarSize,
  minAvatarSize,
  primaryAvatar,
  ...props
}) => (
  <CenteredView {...props}>
    {primaryAvatar ? (
      <CenteredAvatar size={maxAvatarSize} source={primaryAvatar} />
    ) : null}
    {renderRandomAvatars({
      avatars,
      maxAvatarSize,
      minAvatarSize,
      primaryAvatar,
    })}
  </CenteredView>
);

AvatarCloud.propTypes = {
  avatars: PropTypes.arrayOf(ImageSourceType).isRequired,
  maxAvatarSize: PropTypes.number, // a percentage represented as a whole number
  minAvatarSize: PropTypes.number, // a percentage represented as a whole number
  primaryAvatar: ImageSourceType, // The source to render a larger avatar at the center of the cloud
};

AvatarCloud.defaultProps = {
  maxAvatarSize: 50,
  minAvatarSize: 10,
};

export default AvatarCloud;
