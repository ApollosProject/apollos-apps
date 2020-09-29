import React, { useState } from 'react';

import { View } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';
import { times } from 'lodash';

import { Button } from '../..';
import AvatarCloud from '.';

const avatars = [
  'https://picsum.photos/200?1',
  'https://picsum.photos/200?2',
  'https://picsum.photos/200?3',
];

const generateAvatars = (count = 10) => {
  const seed = Math.abs(Math.random() * 100);
  return times(count, (i) => `https://picsum.photos/200?${i + seed}`);
};

function RadialWithRefresh(props) {
  const [avatars, setAvatars] = useState(generateAvatars());
  const [seed, setSeed] = useState(Math.random());
  return (
    <>
      <AvatarCloud radial avatars={avatars} seed={seed} {...props} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button title="Three" onPress={() => setAvatars(generateAvatars(3))} />
        <Button title="Ten" onPress={() => setAvatars(generateAvatars(10))} />
        <Button
          title="One Hundred"
          onPress={() => setAvatars(generateAvatars(100))}
        />
      </View>
      <Button title="Refresh" style={{ marginBottom: 30 }} onPress={() => setSeed(Math.random())} />
    </>
  );
}

storiesOf('ui-kit/Avatar/AvatarCloud', module)
  .add('default', () => <AvatarCloud avatars={avatars} />)
  .add('radial', () => <RadialWithRefresh />)
  .add('radial w/ primary avatar', () => (
    <RadialWithRefresh primaryAvatar={'https://picsum.photos/200'} />
  ))
  .add('blur (false)', () => <AvatarCloud avatars={avatars} blur={false} />)
  .add('isLoading', () => (
    <AvatarCloud avatars={['', '', '']} primaryAvatar={''} isLoading />
  ))
  .add('maxAvatarWidth', () => (
    <AvatarCloud avatars={avatars} maxAvatarWidth={0.1} />
  ))
  .add('minAvatarWidth', () => (
    <AvatarCloud avatars={avatars} minAvatarWidth={1} />
  ))
  .add('primaryAvatar', () => (
    <AvatarCloud
      avatars={avatars}
      primaryAvatar={'https://picsum.photos/200'}
    />
  ));
