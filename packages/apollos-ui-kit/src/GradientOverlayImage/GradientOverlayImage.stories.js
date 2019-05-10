import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import GradientOverlayImage from '.';

storiesOf('ui-kit/GradientOverlayImage', module)
  .add('Default', () => (
    <GradientOverlayImage source={'https://picsum.photos/600/400/?random'} />
  ))
  .add('With Overlay', () => (
    <GradientOverlayImage
      source={'https://picsum.photos/600/400/?random'}
      overlayColor={'salmon'}
    />
  ));
