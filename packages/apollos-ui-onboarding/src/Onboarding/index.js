import React from 'react';
import { useQuery } from '@apollo/client';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  styled,
  named,
  BackgroundView,
  NavigationService,
} from '@apollosproject/ui-kit';

import {
  AskNotificationsConnected,
  FeaturesConnected,
  LocationFinderConnected,
  FollowConnected,
} from '../slides';
import OnboardingSwiper from '../OnboardingSwiper';
import { onboardingComplete, WITH_USER_ID } from '../onboardingStatus';

const OnboardingBackgroundView = named(
  'ui-onboarding.Onboarding.OnboardingBackgroundView'
)(BackgroundView);

const FullscreenBackgroundView = styled({
  position: 'absolute',
  width: '100%',
  height: '100%',
})(OnboardingBackgroundView);

// Represents the current version of onboarding.
// Some slides will be "older", they shouldn't be shown to existing users.
// Some slides will be the same version as teh current onboarding version.
// Those slides will be shown to any user with an older version than the version of those slides.
export const ONBOARDING_VERSION = 2;

function Onboarding() {
  const route = useRoute();
  const navigation = useNavigation();

  const userVersion = route?.params?.userVersion || 0;
  const slides = route?.params?.slides || [
    FeaturesConnected,
    LocationFinderConnected,
    AskNotificationsConnected,
    FollowConnected,
  ];
  const { data } = useQuery(WITH_USER_ID, { fetchPolicy: 'network-only' });
  return (
    <>
      <FullscreenBackgroundView />
      <OnboardingSwiper
        userVersion={userVersion}
        onComplete={() => {
          onboardingComplete({
            userId: data?.currentUser?.id,
            version: ONBOARDING_VERSION,
          });
          navigation.dispatch(
            NavigationService.resetAction({
              navigatorName: 'Tabs',
              routeName: 'Home',
            })
          );
        }}
      >
        {({ swipeForward }) => (
          <>
            {slides.map((Slide) => (
              <Slide key={Slide.displayName} onPressPrimary={swipeForward} />
            ))}
          </>
        )}
      </OnboardingSwiper>
    </>
  );
}

export default Onboarding;
