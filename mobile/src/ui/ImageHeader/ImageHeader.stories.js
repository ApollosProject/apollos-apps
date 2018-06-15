import React from 'react';
import { storiesOf } from '@storybook/react-native';

import ImageHeader from './';

storiesOf('ImageHeader', module)
  .add('Default', () => (
    <ImageHeader images={'https://picsum.photos/600/400/?random'} />
  ))
  .add('With Overlay', () => (
    <ImageHeader
      images={'https://picsum.photos/600/400/?random'}
      imageOverlayColor={'salmon'}
    />
  ));
