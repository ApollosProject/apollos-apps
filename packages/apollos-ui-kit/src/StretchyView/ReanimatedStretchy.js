// experimental
import React, { useCallback } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';

const Stretchy = ({ children, stretchOn = 'top', scrollY, style }) => {
  const layoutHeight = useSharedValue(0);

  const handleLayout = useCallback(
    ({ nativeEvent }) => {
      layoutHeight.value = nativeEvent.layout.height;
    },
    [layoutHeight]
  );

  const translateY = useDerivedValue(() => {
    if (!scrollY || !layoutHeight.value) return 0;
    if (stretchOn === 'top') {
      if (scrollY.value >= 0) return 0;
      return scrollY.value / 2;
    }

    if (stretchOn === 'bottom') {
      // todo
    }

    return 0;
  });

  const scale = useDerivedValue(() => {
    if (!scrollY || !layoutHeight.value) return 1;
    if (stretchOn === 'top') {
      if (scrollY.value >= 0) return 1;
      // y1 = 1 (scale)
      // y2 = 2
      // x1 = 0 (scrollY)
      // x2 = -layoutHeight
      // y = y1 + (x - x1)((y2 - y1) / (x2 - x1))
      return 1 + scrollY.value * (1 / -layoutHeight.value);
    }

    if (stretchOn === 'bottom') {
      // todo
      console.warn(
        'ReanimatedStretchy does not currently support bottom stretchies'
      );
    }

    return 1;
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]} onLayout={handleLayout}>
      {children}
    </Animated.View>
  );
};

Stretchy.propTypes = {
  scrollY: PropTypes.shape({
    value: PropTypes.number,
  }),
  children: PropTypes.node,
  stretchOn: PropTypes.oneOf(['top', 'bottom']),
  style: PropTypes.any, // eslint-disable-line
};

export default Stretchy;
