import React from 'react';
import { storiesOf } from '@storybook/react-native';

import Launch from '.';

storiesOf('Onboarding/slides/Launch', module)
  .add('default', () => <Launch />)
  .add('slideTitle', () => <Launch slideTitle={'Custom title text'} />)
  .add('description', () => <Launch description={'Custom description text'} />)
  .add('SlideWrapper props', () => <Launch onboardingScrollBy={() => {}} />);
