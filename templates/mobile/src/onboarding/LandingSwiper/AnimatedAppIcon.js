import { View, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Animated, {
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import Color from 'color';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@apollosproject/ui-kit';

const Rotator = ({ index, size = 134 }) => {
  const theme = useTheme();
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
    <Animated.View style={styles.rotatorContainer} entering={entering}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[
          Color(theme.colors.primary).lighten(0.4).saturate(0.4).toString(),
          theme.colors.primary,
        ]}
        style={[styles.linearGradient({ size })]}
      >
        <Image style={styles.icon(size)} source={require('img/icon.png')} />
      </LinearGradient>
    </Animated.View>
  );
};

Rotator.propTypes = {
  index: PropTypes.number,
  size: PropTypes.number,
};

const AnimatedAppIcon = ({ size }) => {
  return (
    <View style={styles.container}>
      <Rotator index={2} size={size} />
      <Rotator index={1} size={size} />
      <Rotator index={0} size={size} />
    </View>
  );
};

AnimatedAppIcon.propTypes = {
  size: PropTypes.number,
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  rotatorContainer: { position: 'absolute' },
  icon: (size) => ({
    width: size,
    height: size,
  }),
  linearGradient: ({ size }) => ({
    borderRadius: size / 4.1875,
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
  }),
});

export default AnimatedAppIcon;
