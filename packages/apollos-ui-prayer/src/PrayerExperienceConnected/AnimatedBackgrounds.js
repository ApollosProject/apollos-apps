import React from 'react';
import PropTypes from 'prop-types';

import { Animated, StyleSheet } from 'react-native';

import { BackgroundImageBlur } from '@apollosproject/ui-kit';

// TODO: Let's consider moving this to ui-kit when
// we're more comfortable with this API.
const AnimatedBackgrounds = ({
  animatedIndex,
  backgrounds,
  BackgroundComponent = BackgroundImageBlur,
}) => (
  <>
    {backgrounds.map((background, i) => (
      <Animated.View
        key={i} // eslint-disable-line
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: animatedIndex.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [0, 1, 1],
            }),
          },
        ]}
      >
        <BackgroundComponent source={background} />
      </Animated.View>
    ))}
  </>
);

AnimatedBackgrounds.propTypes = {
  animatedIndex: PropTypes.instanceOf(Animated.Value),
  backgrounds: PropTypes.array, // eslint-disable-line
  BackgroundComponent: PropTypes.func,
};

export default AnimatedBackgrounds;
