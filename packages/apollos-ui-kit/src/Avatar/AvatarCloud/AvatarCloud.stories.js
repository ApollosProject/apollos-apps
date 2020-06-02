import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';

import AvatarCloud from '.';

const avatars = [
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
];

storiesOf('ui-kit/Avatar/AvatarCloud', module)
  .add('default', () => <AvatarCloud avatars={avatars} />)
  .add('maxAvatarSize', () => (
    <AvatarCloud avatars={avatars} maxAvatarSize={10} />
  ))
  .add('minAvatarSize', () => (
    <AvatarCloud avatars={avatars} minAvatarSize={100} />
  ))
  .add('primaryAvatar', () => (
    <AvatarCloud
      avatars={avatars}
      primaryAvatar={'https://picsum.photos/200'}
    />
  ));
