import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import AskNotifications from './AskNotifications';

storiesOf('ui-onboarding/slides/AskNotifications', module)
  .add('default', () => <AskNotifications />)
  .add('BackgroundComponent', () => (
    <AskNotifications
      BackgroundComponent={
        <GradientOverlayImage
          source={'https://picsum.photos/640/640/?random'}
        />
      }
    />
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
