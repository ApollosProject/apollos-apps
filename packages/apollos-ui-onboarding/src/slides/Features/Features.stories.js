import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import Features from './Features';

storiesOf('ui-onboarding/slides/Features', module)
  .add('default', () => <Features isLoading />)
  .add('firstName', () => <Features firstName={'firstName'} />)
  .add('slideTitle', () => <Features slideTitle={'Custom title text'} />)
  .add('description', () => (
    <Features description={'Custom description text'} />
  ))
  .add('BackgroundComponent', () => (
    <Features
      BackgroundComponent={
        <GradientOverlayImage
          source={'https://picsum.photos/750/750/?random'}
        />
      }
    />
  ))
  .add('Slide props', () => <Features onPressPrimary={() => {}} />);
