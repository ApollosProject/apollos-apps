import React from 'react';
import { storiesOf } from '@storybook/react-native';

import AskNotifications from '.';

storiesOf('Onboarding/slides/AskNotifications', module)
  .add('default', () => <AskNotifications />)
  .add('imageSource', () => (
    <AskNotifications imageSource={'https://picsum.photos/640/640/?random'} />
  ))
  .add('slideTitle', () => (
    <AskNotifications slideTitle={'Custom title text'} />
  ))
  .add('description', () => (
    <AskNotifications description={'Custom description text'} />
  ))
  .add('buttonDisabled', () => <AskNotifications buttonDisabled />)
  .add('buttonText', () => (
    <AskNotifications
      onPressButton={() => {}}
      buttonText={'Custom button text'}
    />
  ))
  .add('SlideWrapper props', () => (
    <AskNotifications onPressSecondary={() => {}} />
  ));
