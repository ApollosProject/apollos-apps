import * as React from 'react';
import { Animated } from 'react-native';

/**
 * This hook combines fullscreenAnimation and collapsedAnimation
 * into a single Animated Value.
 * Both fullscreenAnimation and collapsedAnimation have an input range of 0 to 1,
 * this combines them to a single animation with a range from -1 to 1, where
 * - the value is 1 whenever fullscreenAnimation is 1,
 * - the value is -1 whenever collapsedAnimation is 1,
 * - the value is 0 whenever both fullscreenAnimation and collapsedAnimation is 0
 */
const usePresentationAnimation = ({
  fullscreenAnimation,
  collapsedAnimation,
}: {
  fullscreenAnimation: Animated.Value;
  collapsedAnimation: Animated.Value;
}): Animated.AnimatedInterpolation =>
  React.useMemo(() => {
    const negativeCollapsedAnimation = Animated.multiply(
      -1,
      collapsedAnimation
    );
    const offsetFullscreenAnimation = fullscreenAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 2],
    });
    const combinedAnimation = Animated.add(
      negativeCollapsedAnimation,
      offsetFullscreenAnimation
    );

    return combinedAnimation.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [-1, 0, 1],
      extrapolate: 'clamp',
    });
  }, [fullscreenAnimation, collapsedAnimation]);

export default usePresentationAnimation;
