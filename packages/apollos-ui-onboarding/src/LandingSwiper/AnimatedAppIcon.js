import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { AppIcon, styled } from '@apollosproject/ui-kit';
import Animated, {
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

const Container = styled({
  alignItems: 'center',
})(View);

const RotatorContainer = styled({
  position: 'absolute',
})(Animated.View);

const Rotator = ({ index, size = 134 }) => {
  const entering = () => {
    'worklet';

    const animations = {
      opacity: withTiming(1 * 0.5 ** index, { duration: 100 }),
      transform: [
        {
          rotate: withDelay(
            350,
            withSpring(`${index * 17}deg`, { duration: 100 })
          ),
        },
        { scale: withSpring(1, { duration: 300 }) },
      ],
    };
    const initialValues = {
      opacity: 0,
      transform: [{ rotate: '0deg' }, { scale: 5 }],
    };
    return {
      initialValues,
      animations,
    };
  };

  return (
    <RotatorContainer entering={entering}>
      <AppIcon size={size} />
    </RotatorContainer>
  );
};

Rotator.propTypes = {
  index: PropTypes.number,
  size: PropTypes.number,
};

const AnimatedAppIcon = ({ size }) => {
  return (
    <Container>
      <Rotator index={2} size={size} />
      <Rotator index={1} size={size} />
      <Rotator index={0} size={size} />
    </Container>
  );
};

AnimatedAppIcon.propTypes = {
  size: PropTypes.number,
};

export default AnimatedAppIcon;
