import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import OverlayBackgroundImage from '.';

storiesOf('OverlayBackgroundImage', module)
  .add('default', () => (
    <OverlayBackgroundImage source={{ uri: 'https://picsum.photos/600/600' }} />
  ))
  .add('custom color', () => (
    <OverlayBackgroundImage
      overlayType="medium"
      overlayColor="red"
      source={{ uri: 'https://picsum.photos/600/600' }}
    />
  ))
  .add('custom size', () => (
    <OverlayBackgroundImage
      overlayColor={null}
      style={{ width: '100%', height: '75%', aspectRatio: undefined }} // eslint-disable-line react-native/no-inline-styles
      source={{ uri: 'https://picsum.photos/600/600' }}
    />
  ));
