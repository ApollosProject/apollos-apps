import React from 'react';

import { GradientOverlayImage } from '@apollosproject/ui-kit';

import {
  AskNotificationsConnected,
  AskNameConnected,
  FeaturesConnected,
  AboutYouConnected,
  LocationFinderConnected,
  OnboardingSwiper,
} from '@apollosproject/ui-onboarding';

import {
  requestPushPermissions,
  getNotificationsEnabled,
} from 'apolloschurchapp/src/notifications';

function Onboarding({ navigation }) {
  return (
    <OnboardingSwiper>
      {({ swipeForward }) => (
        <>
          <AskNameConnected onPressPrimary={swipeForward} />
          <FeaturesConnected
            onPressPrimary={swipeForward}
            BackgroundComponent={
              <GradientOverlayImage
                source={'https://picsum.photos/640/640/?random'}
              />
            }
          />
          <AboutYouConnected
            onPressPrimary={swipeForward}
            BackgroundComponent={
              <GradientOverlayImage
                source={'https://picsum.photos/640/640/?random'}
              />
            }
          />
          <LocationFinderConnected
            onPressPrimary={swipeForward}
            onNavigateToLocationFinder={() => {
              navigation.navigate('Location', {
                onFinished: swipeForward,
              });
            }}
            BackgroundComponent={
              <GradientOverlayImage
                source={'https://picsum.photos/640/640/?random'}
              />
            }
          />
          <AskNotificationsConnected
            onPressPrimary={() => navigation.navigate('Home')}
            onRequestPushPermissions={requestPushPermissions}
            primaryNavText={'Finish'}
            BackgroundComponent={
              <GradientOverlayImage
                source={'https://picsum.photos/640/640/?random'}
              />
            }
          />
        </>
      )}
    </OnboardingSwiper>
  );
}

Onboarding.navigationOptions = {
  title: 'Onboarding',
  header: null,
  gesturesEnabled: false,
};

export default Onboarding;
