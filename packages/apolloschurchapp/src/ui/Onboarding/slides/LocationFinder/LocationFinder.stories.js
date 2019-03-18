import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { GradientOverlayImage } from '@apollosproject/ui-kit';

import LocationFinder from './LocationFinder';

const campus = {};

storiesOf('Onboarding/slides/LocationFinder', module)
  .add('default', () => <LocationFinder />)
  .add('children (image)', () => (
    <LocationFinder>
      <GradientOverlayImage source={'https://picsum.photos/640/640/?random'} />
    </LocationFinder>
  ))
  .add('slideTitle', () => <LocationFinder slideTitle={'Custom title text'} />)
  .add('description', () => (
    <LocationFinder description={'Custom description text'} />
  ))
  .add('buttonDisabled', () => (
    <LocationFinder buttonDisabled campus={campus} />
  ))
  .add('buttonText', () => (
    <LocationFinder
      onPressButton={() => {}}
      buttonText={'Custom button text'}
    />
  ))
  .add('SlideWrapper props', () => (
    <LocationFinder onPressSecondary={() => {}} />
  ));
