import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../../CenteredView';

import AvatarList from '.';

const avatars = [
  {
    id: '1',
    source: { uri: 'https://picsum.photos/200' },
    notification: true,
  },
  {
    id: '2',
    source: { uri: 'https://picsum.photos/200' },
    notification: true,
  },
  {
    id: '3',
    source: { uri: 'https://picsum.photos/200' },
    notification: true,
  },
  {
    id: '4',
    source: { uri: 'https://picsum.photos/200' },
    notification: false,
  },
  {
    id: '5',
    source: { uri: 'https://picsum.photos/200' },
    notification: false,
  },
  {
    id: '6',
    source: { uri: 'https://picsum.photos/200' },
    notification: false,
  },
  {
    id: '7',
    source: { uri: 'https://picsum.photos/200' },
    notification: false,
  },
  {
    id: '8',
    source: { uri: 'https://picsum.photos/200' },
    notification: false,
  },
];

storiesOf('ui-kit/Avatar/AvatarList', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: 'stretch' /* eslint-disable-line */ }}>
      <View>{story()}</View>
    </CenteredView>
  ))
  .add('default', () => <AvatarList avatars={avatars} />)
  .add('isLoading', () => {
    const emptyData = [
      {
        id: '1',
        source: { uri: '' },
      },
      {
        id: '2',
        source: { uri: '' },
      },
      {
        id: '3',
        source: { uri: '' },
      },
      {
        id: '4',
        source: { uri: '' },
      },
      {
        id: '5',
        source: { uri: '' },
      },
      {
        id: '6',
        source: { uri: '' },
      },
      {
        id: '7',
        source: { uri: '' },
      },
      {
        id: '8',
        source: { uri: '' },
      },
    ];
    return (
      <AvatarList
        avatars={emptyData}
        isLoading
        onPressAdd={() => {}}
        title={'Example title'}
      />
    );
  })
  .add('onPressAdd', () => (
    <AvatarList avatars={avatars} onPressAdd={() => {}} />
  ))
  .add('onPressAvatar', () => (
    <AvatarList
      avatars={avatars}
      onPressAvatar={() => {}}
      onPressAdd={() => {}}
    />
  ));
