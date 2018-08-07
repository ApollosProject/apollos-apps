import React from 'react';
import { storiesOf } from '@storybook/react-native';

import VideoPlayer from '.';

storiesOf('Video', module).add('Example', () => (
  <VideoPlayer
    source={{
      uri:
        'http://embed.wistia.com/deliveries/f14c95b710c203f49551373bd37e9685694d6b5b.bin',
    }}
  />
));
