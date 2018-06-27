import React from 'react';
import { storiesOf } from '@storybook/react-native';

import SquareTile from './';

storiesOf('SquareTile', module)
  .add('Default', () => (
    <SquareTile
      image={'https://picsum.photos/600/400/?random'}
      link={'https://github.com'}
      text={'So cool!'}
    />
  ))
  .add('without text', () => (
    <SquareTile
      image={'https://picsum.photos/600/400/?random'}
      link={'https://github.com'}
    />
  ));
