/**
 * FanEffect.js
 *
 * Created: Jul 06, 2022
 *
 * Takes a collection of elements and
 */

import React from 'react';
import PropTypes from 'prop-types';
import Animated, {
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'blue',
    position: 'relative',
    display: 'flex',
  },
  rotator: {
    position: 'absolute',
  },
});

export const Rotator = ({ children, index }) => {
  const entering = () => {
    'worklet';

    const animations = {
      opacity: withTiming(1 * 0.75 ** index, { duration: 100 }),
      transform: [
        {
          rotate: withDelay(
            350,
            withSpring(`${index * -8}deg`, { duration: 100 })
          ),
        },
        { scale: withSpring(1, { duration: 300 }) },
      ],
    };
    const initialValues = {
      opacity: 0,
      transform: [{ rotate: '0deg' }, { scale: 0.2 }],
    };
    return {
      initialValues,
      animations,
    };
  };

  return (
    <Animated.View style={styles.rotator} entering={entering}>
      {children}
    </Animated.View>
  );
};

Rotator.propTypes = {
  index: PropTypes.number.isRequired,
};

const FanEffect = ({ children }) => {
  const indexedChildren = [];
  React.Children.forEach(children, (child, i) => {
    indexedChildren.push(<Rotator index={i}>{child}</Rotator>);
  });
  return <View style={styles.container}>{indexedChildren.reverse()}</View>;
};

FanEffect.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Rotator),
    PropTypes.arrayOf(PropTypes.instanceOf(Rotator)),
  ]),
};
FanEffect.defaultProps = {};

export default FanEffect;
