import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import Screen from '.';

storiesOf('Onboarding/Screen', module)
  .add('default', () => (
    <Screen>
      <Text>Boom</Text>
    </Screen>
  ))
  .add('With Navigation', () => (
    <Screen onboardingScrollBy={() => {}}>
      <Text>Boom</Text>
    </Screen>
  ))
  .add('primaryNavText', () => (
    <Screen onboardingScrollBy={() => {}} primaryNavText={'Custom button text'}>
      <Text>Boom</Text>
    </Screen>
  ))
  .add('primaryNavIcon', () => (
    <Screen
      onboardingScrollBy={() => {}}
      primaryNavText={'Custom icon'}
      primaryNavIcon={'umbrella'}
    >
      <Text>Boom</Text>
    </Screen>
  ))
  .add('With Skip Button', () => (
    <Screen onboardingScrollBy={() => {}} onboardingSkipTo={() => {}}>
      <Text>Boom</Text>
    </Screen>
  ))
  .add('With Skip Button', () => (
    <Screen
      onboardingScrollBy={() => {}}
      onboardingSkipTo={() => {}}
      secondaryNavText={'Custom skip button'}
    >
      <Text>Boom</Text>
    </Screen>
  ))
  .add('hidePrimaryNav', () => (
    <Screen
      onboardingScrollBy={() => {}}
      onboardingSkipTo={() => {}}
      hidePrimaryNav
    >
      <Text>Boom</Text>
    </Screen>
  ));
