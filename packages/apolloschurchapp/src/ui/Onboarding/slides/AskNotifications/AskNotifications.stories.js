import React from 'react';
import { storiesOf } from '@storybook/react-native';

import AskNotifications from '.';

storiesOf('Onboarding/slides/AskNotifications', module)
  .add('default', () => <AskNotifications />)
  .add('SlideWrapper props', () => (
    <AskNotifications onPressSecondary={() => {}} />
  ));
