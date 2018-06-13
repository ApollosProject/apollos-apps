import React from 'react';
import { storiesOf } from '@storybook/react-native';

import FeedView from './';

storiesOf('FeedView', module).add('Default', () => (
  <FeedView
    content={[
      {
        id: '1',
        title: "Will I get to shake Jesus' hand?",
        channelType: 'eschatology',
        coverImage: [
          {
            uri: 'https://picsum.photos/600/400/?random',
            width: 600,
            height: 400,
          },
        ],
        theme: {
          isLight: true,
          colors: {
            background: {
              paper: '#fa8072',
            },
          },
        },
      },
      {
        id: '2',
        title: 'Where is the new Jerusalem anyways?',
        channelType: 'eschatology',
        coverImage: [
          {
            uri: 'https://picsum.photos/600/400/?random',
            width: 600,
            height: 400,
          },
        ],
        theme: {
          isLight: true,
          colors: {
            background: {
              paper: '#e9967a',
            },
          },
        },
      },
    ]}
  />
));
