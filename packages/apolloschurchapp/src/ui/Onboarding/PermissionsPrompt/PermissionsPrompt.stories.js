import React from 'react';
import { storiesOf } from '@storybook/react-native';

import Permissions from '.';

storiesOf('Onboarding/PermissionsPrompt', module)
  .add('default', () => <Permissions />)
  .add('backgroundColors', () => (
    <Permissions backgroundColors={['salmon', 'salmon']} />
  ));
