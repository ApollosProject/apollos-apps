import React from 'react';
import { storiesOf } from '@storybook/react-native';

import AskName from '.';

storiesOf('Onboarding/slides/AskName', module)
  .add('default', () => <AskName />)
  .add('slideTitle', () => <AskName slideTitle={'Custom title text'} />)
  .add('description', () => <AskName description={'Custom description text'} />)
  .add('SlideWrapper props', () => <AskName onPressPrimary={() => {}} />);
