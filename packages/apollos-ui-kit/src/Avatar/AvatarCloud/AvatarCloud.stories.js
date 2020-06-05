import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';

import AvatarCloud from '.';

const avatars = [
  'https://picsum.photos/200?1',
  'https://picsum.photos/200?2',
  'https://picsum.photos/200?3',
];

storiesOf('ui-kit/Avatar/AvatarCloud', module)
  .add('default', () => <AvatarCloud avatars={avatars} />)
  .add('maxAvatarWidth', () => (
    <AvatarCloud avatars={avatars} maxAvatarWidth={10} />
  ))
  .add('minAvatarWidth', () => (
    <AvatarCloud avatars={avatars} minAvatarWidth={100} />
  ))
  .add('primaryAvatar', () => (
    <AvatarCloud
      avatars={avatars}
      primaryAvatar={'https://picsum.photos/200'}
    />
  ));
