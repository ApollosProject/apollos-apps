import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { View } from 'react-native';

import styled from '../styled';

import TileImage from './index';

const Square = styled({ aspectRatio: 1 })(View);

storiesOf('ui-kit/TileImage', module)
  .add('Default', () => (
    <Square>
      <TileImage
        image={'https://picsum.photos/600/400/?random'}
        link={'https://github.com'}
        text={'So cool!'}
      />
    </Square>
  ))
  .add('Without text', () => (
    <Square>
      <TileImage
        image={'https://picsum.photos/600/400/?random'}
        link={'https://github.com'}
      />
    </Square>
  ))
  .add('isLoading', () => (
    <Square>
      <TileImage
        image={'https://picsum.photos/600/400/?random'}
        link={'https://github.com'}
        isLoading
      />
    </Square>
  ));
