import React from 'react';
import { Dimensions, View } from 'react-native';
import { sample } from 'lodash';
// import PropTypes from 'prop-types';

import CenteredView from '../../CenteredView';
import ConnectedImage from '../../ConnectedImage';
import styled from '../../styled';

const getRandomHeightWidth = ({ avatarSizes }) => {
  const sizesWithoutLarge = Object.keys(avatarSizes).filter(
    (size) => size !== 'large'
  );

  const randomSize = sample(sizesWithoutLarge);

  return {
    borderRadius: avatarSizes[randomSize] / 2,
    width: avatarSizes[randomSize],
    height: avatarSizes[randomSize],
  };
};

const getRandomXYPosition = ({ imageHeight, imageWidth }) => {
  const positionX = Dimensions.get('window').width - imageWidth;
  const positionY = Dimensions.get('window').height - imageHeight;

  return {
    left: Math.round(Math.random() * positionX),
    top: Math.round(Math.random() * positionY),
  };
};

const RandomAvatar = styled(
  ({ theme }) => ({
    position: 'absolute',
    ...getRandomHeightWidth({ avatarSizes: theme.sizing.avatar }),
    ...getRandomXYPosition({
      imageHeight: theme.sizing.avatar.large,
      imageWidth: theme.sizing.avatar.large,
    }),
  }),
  'ui-kit.AvatarList.RandomAvatar'
)(ConnectedImage);

const UserAvatar = styled(
  ({ theme }) => ({
    borderRadius: theme.sizing.avatar.large / 2,
    height: theme.sizing.avatar.large,
    width: theme.sizing.avatar.large,
    zIndex: 100,
  }),
  'ui-kit.AvatarList.UserAvatar'
)(ConnectedImage);

const AvatarCloud = () => (
  <CenteredView>
    <UserAvatar source={'https://picsum.photos/200'} />
    <RandomAvatar source={'https://picsum.photos/200'} />
    <RandomAvatar source={'https://picsum.photos/200'} />
    <RandomAvatar source={'https://picsum.photos/200'} />
    <RandomAvatar source={'https://picsum.photos/200'} />
  </CenteredView>
);

export default AvatarCloud;
