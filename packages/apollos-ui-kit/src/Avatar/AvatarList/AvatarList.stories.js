import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../../CenteredView';

import AvatarList from '.';

const avatars = [
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
];

storiesOf('ui-kit/Avatar/AvatarList', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: 'stretch' /* eslint-disable-line */ }}>
      {story()}
    </CenteredView>
  ))
  .add('default', () => <AvatarList avatars={avatars} />)
  .add('isLoading', () => (
    <AvatarList
      avatars={['', '', '', '', '', '', '', '']}
      isLoading
      title={'Example title'}
      isCard={false}
    />
  ))
  .add('onPressAdd', () => (
    <AvatarList avatars={avatars} onPressAdd={() => {}} />
  ));
