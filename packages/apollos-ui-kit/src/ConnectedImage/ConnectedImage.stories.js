import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import ConnectedImage from '.';

storiesOf('ui-kit/ConnectedImage', module)
  .add('default', () => (
    <ConnectedImage
      style={{ width: 300, height: 200 }} // eslint-disable-line react-native/no-inline-styles
      source={{ uri: 'https://picsum.photos/600/400/?random' }}
    />
  ))
  .add('maintainAspectRatio', () => (
    <ConnectedImage
      source={{ uri: 'https://picsum.photos/600/400/?random' }}
      maintainAspectRatio
    />
  ))
  .add('minHeight', () => (
    <ConnectedImage
      source={{ uri: 'https://picsum.photos/600/400/?random' }}
      minHeight={600}
      maintainAspectRatio
    />
  ))
  .add('maxHeight', () => (
    <ConnectedImage
      source={{ uri: 'https://picsum.photos/600/400/?random' }}
      minHeight={200}
      maintainAspectRatio
    />
  ))
  .add('smoke test min+max height', () => (
    <React.Fragment>
      <ConnectedImage
        source={{ uri: 'https://picsum.photos/600/400/?random' }}
        minHeight={200}
        style={{ width: 50 }}
        maintainAspectRatio
      />
      <ConnectedImage
        source={{ uri: 'https://picsum.photos/600/400/?random' }}
        maxHeight={100}
        style={{ width: 50 }}
        maintainAspectRatio
      />
      <ConnectedImage
        source={{ uri: 'https://picsum.photos/600/400/?random' }}
        minHeight={200}
        style={{ width: 500 }}
        maintainAspectRatio
      />
      <ConnectedImage
        source={{ uri: 'https://picsum.photos/600/400/?random' }}
        maxHeight={100}
        style={{ width: 500 }}
        maintainAspectRatio
      />
    </React.Fragment>
  ));
