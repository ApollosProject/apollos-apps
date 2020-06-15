import React from 'react';
import PropTypes from 'prop-types';

import { ActivityIndicator } from '@apollosproject/ui-kit';
import PrayerSwiper from '../PrayerSwiper';
import AddPrayerConnected from '../AddPrayerConnected';
import PrayerOnboardingScreen from '../PrayerOnboardingScreen';
import PrayingScreen from './PrayingScreen';

const PrayingExperience = ({
  index,
  loading,
  prayers,
  track,
  AddPrayerComponent = AddPrayerConnected,
  PrayingScreenComponent = PrayingScreen,
  OnboardingComponent = PrayerOnboardingScreen,
  primaryAvatar,
  willShowOnboarding,
  isOnboarding,
  setIsOnboarding,
  onFinish,
}) => (
  <>
    {loading && !prayers.length ? (
      <ActivityIndicator />
    ) : (
      <PrayerSwiper index={index}>
        {({ swipeForward }) => {
          const handleSwipeForward = () => {
            track({ eventName: 'PrayerSwipeForward' });
            swipeForward();
          };
          return [
            <AddPrayerComponent
              key={'add-prayer'}
              swipeForward={!prayers.length ? onFinish : handleSwipeForward}
              avatars={prayers.map((prayer) => prayer.requestor?.photo) || []}
              primaryAvatar={primaryAvatar}
            />,
            ...prayers.map((prayer, prayerIndex) => (
              <PrayingScreenComponent
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

PrayingExperience.propTypes = {
  index: PropTypes.number,
  loading: PropTypes.bool,
  prayers: PropTypes.arrayOf(PropTypes.shape({})),
  track: PropTypes.func,
  AddPrayerComponent: PropTypes.func,
  PrayingScreenComponent: PropTypes.func,
  OnboardingComponent: PropTypes.func,
  // we just pass this prop to children components, so we don't care about its shape:
  primaryAvatar: PropTypes.any, // eslint-disable-line
  willShowOnboarding: PropTypes.bool,
  isOnboarding: PropTypes.bool,
  setIsOnboarding: PropTypes.func,
  onFinish: PropTypes.func,
};

export default PrayingExperience;
