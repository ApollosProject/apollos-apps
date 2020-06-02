import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';

// import CenteredView from '../../CenteredView';

import AvatarCloud from '.';

const avatars = [
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
];

storiesOf('ui-kit/Avatar/AvatarCloud', module)
  // .addDecorator((story) => (
  //   <CenteredView style={{ alignItems: 'stretch' /* eslint-disable-line */ }}>
  //     {story()}
  //   </CenteredView>
  // ))
  .add('example', () => (
    <AvatarCloud
      avatars={avatars}
      primaryAvatar={'https://picsum.photos/200'}
    />
  ))
  .add('avatars', () => <AvatarCloud avatars={avatars} />)
  .add('primaryAvatar', () => (
    <AvatarCloud primaryAvatar={'https://picsum.photos/200'} />
  ));
