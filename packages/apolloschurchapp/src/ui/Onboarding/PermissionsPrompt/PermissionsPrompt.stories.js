import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Icon } from '@apollosproject/ui-kit';

import Permissions from '.';

storiesOf('Onboarding/PermissionsPrompt', module)
  .add('default', () => <Permissions />)
  .add('backgroundColors', () => (
    <Permissions backgroundColors={['salmon', 'salmon']} />
  ))
  .add('image', () => (
    <Permissions image={<Icon name={'umbrella'} fill={'white'} />} />
  ));
