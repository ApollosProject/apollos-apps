import React, { useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { AvatarCloud, H3, BodyText, PaddedView } from '@apollosproject/ui-kit';

import PrayerScreen from '../PrayerScreen';

import BackgroundImage from '../PrayerBlurBackground';

const PrayerOnboardingScreen = ({
  avatars,
  primaryAvatar,
  title,
  body,
  visibleOnMount,
  visible,
  ...props
}) => {
  const animation = useRef(new Animated.Value(visibleOnMount ? 1 : 0)).current;
  Animated.spring(animation, { toValue: visible }).start();

  const window = Dimensions.get('window');

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [window.height, 0],
              }),
            },
          ],
        },
      ]}
    >
      <PrayerScreen
        {...props}
        background={<BackgroundImage source={primaryAvatar} />}
      >
        <AvatarCloud
          maxAvatarWidth={0.4}
          primaryAvatar={primaryAvatar}
          avatars={avatars.slice(0, 4)}
        />
        <PaddedView style={{ flexGrow: 1, alignItems: 'center' }}>
          <H3 style={{ textAlign: 'center' }}>{title}</H3>
          <PaddedView style={{ paddingHorizontal: '10%' }}>
            <BodyText style={{ textAlign: 'center' }}>{body}</BodyText>
          </PaddedView>
        </PaddedView>
      </PrayerScreen>
    </Animated.View>
  );
};

PrayerOnboardingScreen.propTypes = {
  avatars: PropTypes.arrayOf(PropTypes.shape({})),
  primaryAvatar: PropTypes.shape({}),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]),
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]),
  visibleOnMount: PropTypes.bool,
  visible: PropTypes.bool,
  primaryActionText: PropTypes.string,
};

PrayerOnboardingScreen.defaultProps = {
  visible: true,
  primaryActionText: 'Next',
  title: 'Join us today in prayer',
  body:
    'Each day we ask the community for prayer. These prayers last for only 24 hours so that you can reach out to our community and ask for what you need today, and every day.',
};

export default PrayerOnboardingScreen;
