import * as React from 'react';
import {
  Animated,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { styled } from '@apollosproject/ui-kit';
import Color from 'color';
import { PictureMode } from '../types';
import { useNowPlaying, usePlayerControls } from '../context';

const FadeoutOverlay: React.FunctionComponent<{
  style?: any;
  fadeTimeoutMs?: number;
  onPress?: (props: { isVisible: boolean }) => void;
}> = ({ children, fadeTimeoutMs = 5000, style, ...other }) => {
  const nowPlaying = useNowPlaying();
  const {
    isPlaying,
    pictureMode,
    isControlVisibilityLocked,
  } = usePlayerControls();
  const isFullscreen = pictureMode === PictureMode.Fullscreen;

  const [isPressing, setIsPressing] = React.useState(false);

  const [isVisible, setIsVisible] = React.useState(
    !isPlaying || isControlVisibilityLocked
  );

  const shouldBeVisible = !isPlaying || isVisible || isControlVisibilityLocked;

  const fadeAnimation = React.useRef(
    new Animated.Value(shouldBeVisible ? 1 : 0)
  ).current;

  const handlePressIn = () => {
    setIsPressing(true);
  };

  const handlePress = () => {
    setIsVisible(!isVisible);
  };

  const handlePressOut = () => {
    setIsPressing(false);
  };

  // when player isFullscreen state changes, or when the media changes,
  // toggle visibility timers
  React.useEffect(() => {
    setIsVisible(true);
  }, [isFullscreen, nowPlaying]);

  React.useEffect(() => {
    Animated.spring(fadeAnimation, {
      toValue: shouldBeVisible ? 1 : 0,
      useNativeDriver: true,
    }).start();

    let timeout: ReturnType<typeof setTimeout>;
    if (!isPressing) {
      timeout = setTimeout(() => setIsVisible(false), fadeTimeoutMs);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [
    isPressing,
    isPlaying,
    isVisible,
    isControlVisibilityLocked,
    fadeAnimation,
    fadeTimeoutMs,
    shouldBeVisible,
  ]);

  const touchable = (
    <TouchableWithoutFeedback
      style={StyleSheet.absoluteFill}
      onPressIn={handlePressIn}
      onPress={handlePress}
      onPressOut={handlePressOut}
    >
      <View style={StyleSheet.absoluteFill} />
    </TouchableWithoutFeedback>
  );

  return (
    <Animated.View style={[{ opacity: fadeAnimation }, style]} {...other}>
      {touchable}

      {children}

      {/* Block touches when overlay visible */}
      {!shouldBeVisible ? touchable : null}
    </Animated.View>
  );
};

const StyledFadeoutOverlay = styled(({ theme }: any) => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: Color(theme?.colors?.background?.screen)
    .alpha(theme?.alpha?.low)
    .string(),
}))(FadeoutOverlay);

export default StyledFadeoutOverlay;
