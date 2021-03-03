import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { Animated } from 'react-native';

import { ActivityIndicator, withTheme, named } from '@apollosproject/ui-kit';

import PrayerSwiper from '../PrayerSwiper';
import {
  AddPrayerScreenConnected,
  PrayerDialogScreen,
  PrayerScreen,
} from '../screens';

import AnimatedBackgrounds from './AnimatedBackgrounds';

const Onboarding = named('ui-prayer.Onboarding')(PrayerDialogScreen);

const PrayerExperience = ({
  index,
  loading,
  prayers,
  track,
  AddPrayerComponent = AddPrayerScreenConnected,
  PrayerScreenComponent = PrayerScreen,
  OnboardingComponent = Onboarding,
  primaryAvatar,
  willShowOnboarding,
  onFinish,
}) => {
  const [isOnboarding, setIsOnboarding] = useState(true);
  const animatedIndex = useRef(new Animated.Value(index || 0)).current;
  return (
    <>
      {loading && !prayers.length ? (
        <ActivityIndicator />
      ) : (
        <>
          <AnimatedBackgrounds
            animatedIndex={animatedIndex}
            backgrounds={[
              primaryAvatar,
              ...prayers.map((prayer) => prayer.requestor?.photo || null),
            ]}
          />
          <PrayerSwiper
            index={index}
            onIndexChanged={(i) =>
              Animated.spring(animatedIndex, {
                toValue: i,
                useNativeDriver: true,
              }).start()
            }
          >
            {({ swipeForward }) => {
              const handleSwipeForward = () => {
                track({ eventName: 'PrayerSwipeForward' });
                swipeForward();
              };
              return [
                <AddPrayerComponent
                  key={'add-prayer'}
                  swipeForward={!prayers.length ? onFinish : handleSwipeForward}
                  avatars={
                    prayers.map((prayer) => prayer.requestor?.photo) || []
                  }
                  primaryAvatar={primaryAvatar}
                />,
                ...prayers.map((prayer, prayerIndex) => (
                  <PrayerScreenComponent
                    key={prayer.id}
                    prayer={prayer}
                    onPressPrimary={
                      prayerIndex < prayers.length - 1
                        ? handleSwipeForward
                        : onFinish
                    }
                  />
                )),
              ];
            }}
          </PrayerSwiper>
        </>
      )}
      {willShowOnboarding ? ( // eslint-disable-line
        <OnboardingComponent
          avatars={prayers.map((prayer) => prayer.requestor?.photo) || []}
          primaryAvatar={primaryAvatar}
          onPressPrimary={() => setIsOnboarding(false)}
          visibleOnMount
          visible={isOnboarding}
        />
      ) : null}
    </>
  );
};

PrayerExperience.propTypes = {
  index: PropTypes.number,
  loading: PropTypes.bool,
  prayers: PropTypes.arrayOf(PropTypes.shape({})),
  track: PropTypes.func,
  AddPrayerComponent: PropTypes.func,
  PrayerScreenComponent: PropTypes.func,
  OnboardingComponent: PropTypes.func,
  // we just pass this prop to children components, so we don't care about its shape:
  primaryAvatar: PropTypes.any, // eslint-disable-line
  willShowOnboarding: PropTypes.bool,
  onFinish: PropTypes.func,
};

export default withTheme(
  () => ({}),
  'ui-prayer.PrayerExperience'
)(PrayerExperience);
