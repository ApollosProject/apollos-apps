import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import SlideWrapper from '.';

storiesOf('Onboarding/SlideWrapper', module)
  .add('default', () => (
    <SlideWrapper>
      <Text>Boom</Text>
    </SlideWrapper>
  ))
  .add('With Navigation', () => (
    <SlideWrapper onboardingScrollBy={() => {}}>
      <Text>Boom</Text>
    </SlideWrapper>
  ))
  .add('primaryNavText', () => (
    <SlideWrapper onboardingScrollBy={() => {}} primaryNavText={'Custom button text'}>
      <Text>Boom</Text>
    </SlideWrapper>
  ))
  .add('primaryNavIcon', () => (
    <SlideWrapper
      onboardingScrollBy={() => {}}
      primaryNavText={'Custom icon'}
      primaryNavIcon={'umbrella'}
    >
      <Text>Boom</Text>
    </SlideWrapper>
  ))
  .add('With Skip Button', () => (
    <SlideWrapper onboardingScrollBy={() => {}} onboardingSkipTo={() => {}}>
      <Text>Boom</Text>
    </SlideWrapper>
  ))
  .add('With Skip Button', () => (
    <SlideWrapper
      onboardingScrollBy={() => {}}
      onboardingSkipTo={() => {}}
      secondaryNavText={'Custom skip button'}
    >
      <Text>Boom</Text>
    </SlideWrapper>
  ))
  .add('hidePrimaryNav', () => (
    <SlideWrapper
      onboardingScrollBy={() => {}}
      onboardingSkipTo={() => {}}
      hidePrimaryNav
    >
      <Text>Boom</Text>
    </SlideWrapper>
  ));
