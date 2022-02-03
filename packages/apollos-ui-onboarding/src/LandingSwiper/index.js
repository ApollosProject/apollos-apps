import React, { useMemo } from 'react';
import { BackgroundView, styled, named } from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardStyleInterpolators } from '@react-navigation/stack';

import { Intro, Scripture, Prayer, Community } from './slides';

const Container = styled(
  () => ({
    flex: 1,
  }),
  'ui-onboarding.LandingSwiper.LandingSlide.Container'
)(SafeAreaView);

const Stack = createSharedElementStackNavigator();

const LandingSwiper = ({ slides, sharedElements, onComplete }) => {
  const slideComponents = useMemo(
    () =>
      slides.map((Slide, index) => {
        const SlideComponent = ({ navigation }) => (
          <Slide
            index={index}
            // Note: Eslint is complaining about `.length` not being apart of propType validation...but
            // the propType is literally set as `.arrayOf` ... so not sure how to fix?
            // eslint-disable-next-line react/prop-types
            totalSlides={slides.length}
            onContinue={() =>
              // eslint-disable-next-line no-nested-ternary,react/prop-types
              index < slides.length - 1
                ? navigation.navigate(`LandingSlide-${index + 1}`)
                : onComplete
                ? onComplete()
                : navigation.navigate(`Auth`)
            }
          />
        );
        return SlideComponent;
      }),
    [slides, onComplete]
  );

  const screens = useMemo(
    () =>
      slideComponents.map((SlideComponent, index) => (
        <Stack.Screen
          name={`LandingSlide-${index}`}
          component={SlideComponent}
          sharedElements={sharedElements}
          // eslint-disable-next-line react/no-array-index-key
          key={index}
        />
      )),
    [slideComponents, sharedElements]
  );

  return (
    <BackgroundView>
      <Container>
        <Stack.Navigator
          initialRouteName="Scripture"
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator:
              CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        >
          {screens}
        </Stack.Navigator>
      </Container>
    </BackgroundView>
  );
};

LandingSwiper.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.func),
  sharedElements: PropTypes.func,
  onComplete: PropTypes.func,
};

LandingSwiper.defaultProps = {
  slides: [Intro, Scripture, Prayer, Community],
  sharedElements: () =>
    ['next-button', 'phone-outline', 'phone-mask', 'callout'].map((id) => ({
      id,
      resize: 'clip',
      animation: 'fade',
    })),
};

export default named('ui-onboarding.LandingSwiper')(LandingSwiper);
