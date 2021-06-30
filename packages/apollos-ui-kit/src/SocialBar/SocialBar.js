import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, Pressable } from 'react-native';

import styled from '../styled';
import { withTheme } from '../theme';
import { UIText } from '../typography';
import Icon from '../Icon';

/**
 * SocialBar
 * Implements https://www.figma.com/file/YHJLj8pdFxWG9npF2YmB3r/UI-Kit-2.0?node-id=429%3A0
 *
 * Status:
 * - [x] Like Button
 * - [x] Share Button
 * - [x] Other Buttons (via child prop)
 * */

const Container = styled(
  ({ theme }) => ({
    width: '100%',
    flexDirection: 'row',
    paddingTop: theme.sizing.baseUnit / 2,
  }),
  'ui-kit.SocialBar.Container'
)(View);

const Touchable = withTheme(
  () => ({
    style: ({ pressed }) => ({
      flexDirection: 'row',
      alignItems: 'center',
      opacity: pressed ? 0.5 : 1,
    }),
  }),
  'ui-kit.SocialBar.Touchable'
)(Pressable);

export const TouchableText = styled(
  ({ theme }) => ({
    color: theme.colors.text.secondary,
  }),
  'ui-kit.SocialBar.TouchableText'
)(UIText);

export const TouchableIcon = withTheme(
  ({ theme }) => ({
    size: theme.sizing.baseUnit * 1.25,
    fill: theme.colors.text.tertiary,
  }),
  'ui-kit.SocialBar.TouchableIcon'
)(Icon);

export const Spacer = styled(
  ({ theme }) => ({
    width: theme.sizing.baseUnit / 3,
  }),
  'ui-kit.SocialBar.Spacer'
)(View);

const SocialBar = ({ onPressLike, onPressShare, isLiked, children, style }) => {
  // If only like button, flex the button to the left
  // If only share button, flex the button to the right
  // Otherwise, distribute space between the buttons
  let justifyContent = 'space-between';
  if (!onPressLike && onPressShare && !children) justifyContent = 'flex-end';
  if (onPressLike && !onPressShare && !children) justifyContent = 'flex-start';
  const containerStyle = useMemo(() => ({ justifyContent }), [justifyContent]);

  return (
    <Container style={[containerStyle, style]}>
      {onPressLike || isLiked ? (
        <Touchable onPress={onPressLike}>
          <TouchableIcon name={isLiked ? 'like-solid' : 'like'} />
          <Spacer />
          <TouchableText>Like{isLiked ? 'd' : ''}</TouchableText>
        </Touchable>
      ) : null}
      {children}
      {onPressShare ? (
        <Touchable onPress={onPressShare}>
          <TouchableText>Share</TouchableText>
          <Spacer />
          <TouchableIcon name="share" />
        </Touchable>
      ) : null}
    </Container>
  );
};

SocialBar.propTypes = {
  onPressLike: PropTypes.func,
  onPressShare: PropTypes.func,
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  isLiked: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
};

export default SocialBar;
