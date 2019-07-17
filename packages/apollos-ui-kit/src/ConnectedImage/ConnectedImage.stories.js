import React from 'react';
import { ScrollView } from 'react-native';
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
  .add('min+max aspectRatio', () => (
    <ScrollView
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ flex: 1 }}
    >
      <ConnectedImage // should render square
        source={{ uri: 'https://picsum.photos/200/200/?random' }}
        maintainAspectRatio
        minAspectRatio={0.5}
        maxAspectRatio={1.5}
      />
      <ConnectedImage // should render as tall
        source={{ uri: 'https://picsum.photos/200/200/?random' }}
        maintainAspectRatio
        maxAspectRatio={0.5}
      />
      <ConnectedImage // should render as short
        source={{ uri: 'https://picsum.photos/200/200/?random' }}
        maintainAspectRatio
        minAspectRatio={2}
      />
      <ConnectedImage // should render as square
        source={{ uri: 'https://picsum.photos/200/200/?random' }}
        maintainAspectRatio
        minAspectRatio={0.75}
        maxAspectRatio={1.2}
      />
      <ConnectedImage // should render as tall (0.75 aspect ratio) but not super tall
        source={{ uri: 'https://picsum.photos/200/2000/?random' }} // 200/2000 = 0.1
        maintainAspectRatio
        minAspectRatio={0.75}
        maxAspectRatio={1.2}
      />
      <ConnectedImage // should render as short (1.2 aspect ratio) but not super short
        source={{ uri: 'https://picsum.photos/2000/200/?random' }} // 2000/200 = 10
        maintainAspectRatio
        minAspectRatio={0.75}
        maxAspectRatio={1.2}
      />
    </ScrollView>
  ));
