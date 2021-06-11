import React, { useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import {
  AvatarCloud,
  BackgroundImageBlur,
  BodyText,
  H3,
  PaddedView,
  styled,
} from '@apollosproject/ui-kit';

import PrayerView from '../../PrayerView';

const Container = styled(
  { flexGrow: 1, alignItems: 'center' },
  'ui-prayer.PrayerDialogScreen.Container'
)(PaddedView);

const HeadingText = styled(
  { textAlign: 'center' },
  'ui-prayer.PrayerDialogScreen.HeadingText'
)(H3);

const BodyContainer = styled(
  { paddingHorizontal: '10%' },
  'ui-prayer.PrayerDialogScreen.BodyContainer'
)(PaddedView);

const ScreenBodyText = styled(
  { textAlign: 'center' },
  'ui-prayer.PrayerDialogScreen.ScreenBodyText'
)(BodyText);

const PrayerDialogScreen = ({
  avatars,
  primaryAvatar,
  title,
  body,
  visibleOnMount,
  visible,
  ...props
}) => {
  const animation = useRef(new Animated.Value(visibleOnMount ? 1 : 0)).current;
  Animated.spring(animation, {
    toValue: visible,
    useNativeDriver: true,
  }).start();

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
      <BackgroundImageBlur source={primaryAvatar}>
        <PrayerView {...props}>
          <AvatarCloud
            maxAvatarWidth={0.4}
            primaryAvatar={primaryAvatar}
            avatars={avatars.slice(0, 4)}
          />
          <Container>
            <HeadingText>{title}</HeadingText>
            <BodyContainer>
              <ScreenBodyText>{body}</ScreenBodyText>
            </BodyContainer>
          </Container>
        </PrayerView>
      </BackgroundImageBlur>
    </Animated.View>
  );
};

PrayerDialogScreen.propTypes = {
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

PrayerDialogScreen.defaultProps = {
  visible: true,
  primaryActionText: 'Next',
  title: 'Join us today in prayer',
  body:
    'Each day we ask the community for prayer. These prayers last for only 24 hours so that you can reach out to our community and ask for what you need today, and every day.',
};

export default PrayerDialogScreen;
