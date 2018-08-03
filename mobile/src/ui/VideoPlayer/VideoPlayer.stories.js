import React from 'react';
import { Platform } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import VideoPlayer from '.';

storiesOf('Video', module).add('Example', () => (
  <VideoPlayer
    source={Platform.select({
      ios: {
        uri: 'https://s3.amazonaws.com/x265.org/video/Tears_400_x265.mp4',
      },
      android: {
        uri:
          'http://embed.wistia.com/deliveries/f14c95b710c203f49551373bd37e9685694d6b5b.bin',
      },
    })}
  />
));
