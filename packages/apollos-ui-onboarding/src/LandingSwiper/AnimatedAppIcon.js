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

const Rotator = ({ index }) => {
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
      transform: [{ rotate: `0deg` }, { scale: 5 }],
    };
    return {
      initialValues,
      animations,
    };
  };

  return (
    <RotatorContainer entering={entering}>
      <AppIcon size={134} />
    </RotatorContainer>
  );
};

Rotator.propTypes = {
  index: PropTypes.number,
};

const AnimatedAppIcon = () => {
  return (
    <Container>
      <Rotator index={2} />
      <Rotator index={1} />
      <Rotator index={0} />
    </Container>
  );
};

export default AnimatedAppIcon;
