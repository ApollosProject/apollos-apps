import React from 'react';
import PropTypes from 'prop-types';

import { ActivityIndicator, withTheme } from '@apollosproject/ui-kit';

import PrayerSwiper from '../PrayerSwiper';
import {
  AddPrayerScreenConnected,
  PrayerDialogScreen,
  PrayerScreen,
} from '../screens';

const PrayerExperience = ({
  index,
  loading,
  prayers,
  track,
  AddPrayerComponent = AddPrayerScreenConnected,
  PrayingScreenComponent = PrayerScreen,
  OnboardingComponent = PrayerDialogScreen,
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

PrayerExperience.propTypes = {
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

export default withTheme(() => ({}), 'ui-prayer.PrayerExperience')(
  PrayerExperience
);
