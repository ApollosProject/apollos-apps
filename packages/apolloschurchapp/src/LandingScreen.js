import React from 'react';
import { styled, GradientOverlayImage } from '@apollosproject/ui-kit';

import ApollosLandingScreen from './ui/LandingScreen';
import NavigationService from './NavigationService';

const FullScreenImage = styled({
  resizeMode: 'cover',
  position: 'absolute',
})(GradientOverlayImage);

const LandingScreen = () => (
  <ApollosLandingScreen
    onPressPrimary={() => NavigationService.navigateToAuth()}
    textColor={'white'}
    BackgroundComponent={
      <FullScreenImage source={'https://picsum.photos/375/812/?random'} />
    }
    primaryNavText={"Let's go!"}
  />
);

LandingScreen.navigationOptions = {
  header: null,
};

export default LandingScreen;
