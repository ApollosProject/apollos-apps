import React from 'react';
import PropTypes from 'prop-types';
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
import ONBOARDING_VERSION from './version';

const OnboardingBackgroundView = named(
  'ui-onboarding.Onboarding.OnboardingBackgroundView'
)(BackgroundView);

const FullscreenBackgroundView = styled({
  position: 'absolute',
  width: '100%',
  height: '100%',
})(OnboardingBackgroundView);

export { ONBOARDING_VERSION };

function Onboarding(props) {
  const route = useRoute();
  const navigation = useNavigation();

  const userVersion = route?.params?.userVersion || props?.userVersion || 0;
  const slides = props?.slides || [
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

Onboarding.propTypes = {
  userVersion: PropTypes.number,
  slides: PropTypes.arrayOf(PropTypes.shape({})),
};

export default named('ui-onboarding.Onboarding')(Onboarding);
