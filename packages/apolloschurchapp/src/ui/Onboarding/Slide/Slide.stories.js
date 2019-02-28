import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import Slide from '.';

storiesOf('Onboarding/Slide', module)
  .add('default', () => (
    <Slide>
      <Text>Boom</Text>
    </Slide>
  ))
  .add('With Navigation', () => (
    <Slide onboardingScrollBy={() => {}}>
      <Text>Boom</Text>
    </Slide>
  ))
  .add('primaryNavText', () => (
    <Slide onboardingScrollBy={() => {}} primaryNavText={'Custom button text'}>
      <Text>Boom</Text>
    </Slide>
  ))
  .add('primaryNavIcon', () => (
    <Slide
      onboardingScrollBy={() => {}}
      primaryNavText={'Custom icon'}
      primaryNavIcon={'umbrella'}
    >
      <Text>Boom</Text>
    </Slide>
  ))
  .add('With Skip Button', () => (
    <Slide onboardingScrollBy={() => {}} onboardingSkipTo={() => {}}>
      <Text>Boom</Text>
    </Slide>
  ))
  .add('With Skip Button', () => (
    <Slide
      onboardingScrollBy={() => {}}
      onboardingSkipTo={() => {}}
      secondaryNavText={'Custom skip button'}
    >
      <Text>Boom</Text>
    </Slide>
  ))
  .add('hidePrimaryNav', () => (
    <Slide
      onboardingScrollBy={() => {}}
      onboardingSkipTo={() => {}}
      hidePrimaryNav
    >
      <Text>Boom</Text>
    </Slide>
  ));
