import React from 'react';
import { storiesOf } from '@storybook/react-native';

import AboutYou from '.';

storiesOf('Onboarding/slides/AboutYou', module)
  .add('default', () => <AboutYou />)
  .add('slideTitle', () => <AboutYou slideTitle={'Custom title text'} />)
  .add('description', () => (
    <AboutYou description={'Custom description text'} />
  ))
  .add('SlideWrapper props', () => <AboutYou onboardingScrollBy={() => {}} />);
