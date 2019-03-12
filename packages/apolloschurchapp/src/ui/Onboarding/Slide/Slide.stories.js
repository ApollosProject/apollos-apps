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
    <Slide onPressPrimary={() => {}}>
      <Text>Boom</Text>
    </Slide>
  ))
  .add('primaryNavText', () => (
    <Slide onPressPrimary={() => {}} primaryNavText={'Custom button text'}>
      <Text>Boom</Text>
    </Slide>
  ))
  .add('primaryNavIcon', () => (
    <Slide
      onPressPrimary={() => {}}
      primaryNavText={'Custom icon'}
      primaryNavIcon={'umbrella'}
    >
      <Text>Boom</Text>
    </Slide>
  ))
  .add('With Skip Button', () => (
    <Slide onPressPrimary={() => {}} onPressSecondary={() => {}}>
      <Text>Boom</Text>
    </Slide>
  ))
  .add('With Skip Button', () => (
    <Slide
      onPressPrimary={() => {}}
      onPressSecondary={() => {}}
      secondaryNavText={'Custom skip button'}
    >
      <Text>Boom</Text>
    </Slide>
  ))
  .add('hidePrimaryNav', () => (
    <Slide onPressPrimary={() => {}} onPressSecondary={() => {}} hidePrimaryNav>
      <Text>Boom</Text>
    </Slide>
  ));
