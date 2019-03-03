import React from 'react';
import { storiesOf } from '@storybook/react-native';

import Features from '.';

storiesOf('Onboarding/slides/Features', module)
  .add('default', () => <Features />)
  .add('slideTitle', () => <Features slideTitle={'Custom title text'} />)
  .add('description', () => (
    <Features description={'Custom description text'} />
  ))
  .add('SlideWrapper props', () => <Features onboardingScrollBy={() => {}} />);
