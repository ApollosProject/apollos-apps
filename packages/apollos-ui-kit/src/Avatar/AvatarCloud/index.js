import React from 'react';
import PropTypes from 'prop-types';
import { pack, hierarchy } from 'd3-hierarchy';
import { View } from 'react-native';
import Avatar from '../Avatar';
import { useTheme, named } from '../../theme';
import styled from '../../styled';

const Container = styled(
  ({ theme, size }) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.system,
  }),
  'AvatarCloud.Container'
)(View);

const Leaf = styled(
  ({ leaf }) => ({
    position: 'absolute',
    left: leaf.x - leaf.r || null,
    top: leaf.y - leaf.r || null,
  }),
  'AvatarCloud.Leaf'
)(View);

const AvatarCloud = ({
  avatars = [], // deprecated
  primaryAvatar, // kinda deprecated...
  profiles = [], // use this instead
  size = 'medium',
  scaleFactor = 0.6, // the amount smaller each avatar is compared to the next
  ...props
}) => {
  let data = [...profiles];
  if (avatars.length) {
    avatars.forEach((avatar) =>
      data.push({
        id: JSON.stringify(avatar),
        photo: avatar,
      })
    );
  }

  const theme = useTheme();
  let themeSize = size;
  if (typeof themeSize === 'string') {
    themeSize = theme.sizing?.avatar?.[size] || theme.sizing.avatar.medium;
  }

  // compute sizes
  data.forEach((datum, index) => {
    // eslint-disable-next-line no-param-reassign
    datum.value = (data.length - index) * scaleFactor ** index;
  });

  if (primaryAvatar) {
    data = [
      {
        id: JSON.stringify(primaryAvatar),
        photo: primaryAvatar,
        value: data[0].value / scaleFactor,
      },
      ...data,
    ];
  }

  const avatarPack = pack()
    .size([themeSize, themeSize])
    .padding(data.length > 1 ? 6 : 0);
  const avatarHierarchy = hierarchy({ children: data }).sum((d) => d.value);
  const root = avatarPack(avatarHierarchy);
  const leaves = root.leaves().filter((leaf) => leaf.x && leaf.y);

  return (
    <Container size={themeSize} {...props}>
      {leaves.map((leaf) => (
        <Leaf key={leaf.data.id} leaf={leaf}>
          <Avatar profile={leaf.data} themeSize={leaf.r * 2 || themeSize} />
        </Leaf>
      ))}
    </Container>
  );
};

AvatarCloud.propTypes = {
  avatars: PropTypes.arrayOf(PropTypes.object),
  primaryAvatar: PropTypes.shape({}),
  profiles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      photo: PropTypes.shape({}),
    })
  ),
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  scaleFactor: PropTypes.number,
};

export default named('AvatarCloud')(AvatarCloud);
