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
  ))
  .add('overlayType.high', () => (
    <GradientOverlayImage
      source={'https://picsum.photos/600/400/?random'}
      overlayColor={'salmon'}
      overlayType="high"
    />
  ))
  .add('overlayType.medium', () => (
    <GradientOverlayImage
      source={'https://picsum.photos/600/400/?random'}
      overlayColor={'salmon'}
      overlayType="medium"
    />
  ))
  .add('overlayType.low', () => (
    <GradientOverlayImage
      source={'https://picsum.photos/600/400/?random'}
      overlayColor={'salmon'}
      overlayType="low"
    />
  ))
  .add('overlayType.gradient-top', () => (
    <GradientOverlayImage
      source={'https://picsum.photos/600/400/?random'}
      overlayColor={'salmon'}
      overlayType="gradient-top"
    />
  ))
  .add('overlayType.gradient-bottom', () => (
    <GradientOverlayImage
      source={'https://picsum.photos/600/400/?random'}
      overlayColor={'salmon'}
      overlayType="gradient-bottom"
    />
  ))
  .add('overlayType.featured', () => (
    <GradientOverlayImage
      source={'https://picsum.photos/600/400/?random'}
      overlayColor={'salmon'}
      overlayType="featured"
    />
  ));
