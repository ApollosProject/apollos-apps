import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import FeedView from '.';

storiesOf('ui-kit/FeedView', module).add('Example', () => (
  <FeedView
    content={[
      {
        node: {
          id: '1',
          title: "Will I get to shake Jesus' hand?",
          coverImage: [
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ],
          parentChannel: {
            id: '01',
            name: 'eschatology',
            iconName: 'like',
          },
        },
      },
      {
        node: {
          id: '2',
          title: 'Where is the new Jerusalem anyways?',
          coverImage: [
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ],
          parentChannel: {
            id: '02',
            name: 'eschatology',
            iconName: 'like',
          },
        },
      },
    ]}
  />
));
