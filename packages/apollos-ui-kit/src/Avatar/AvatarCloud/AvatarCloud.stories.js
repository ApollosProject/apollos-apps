import React, { useState } from 'react';

import { View, LayoutAnimation } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';
import { times } from 'lodash';

import { Button, H4 } from '../..';
import AvatarCloud from './index';

const generateAvatars = (count = 10, seed) => {
  const aseed = seed || Math.abs(Math.random() * 100);
  return times(count, (i) => `https://picsum.photos/seed/${i + aseed}/200`);
};

function Examples(props) {
  const [avatars, setAvatars] = useState(3);
  const [size, setSize] = useState('large');
  const [seed, setSeed] = useState(Math.random() * 100);

  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

  return (
    <>
      <AvatarCloud
        avatars={generateAvatars(avatars, seed)}
        size={size}
        {...props}
      />

      <H4>Number of avatars</H4>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button title="1" onPress={() => setAvatars(1)} />
        <Button title="2" onPress={() => setAvatars(2)} />
        <Button title="3" onPress={() => setAvatars(3)} />
        <Button title="4" onPress={() => setAvatars(4)} />
        <Button title="5" onPress={() => setAvatars(5)} />
        <Button title="10" onPress={() => setAvatars(10)} />
        <Button title="100" onPress={() => setAvatars(100)} />
      </View>

      <H4>Size</H4>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button title="xs" onPress={() => setSize('xsmall')} />
        <Button title="small" onPress={() => setSize('small')} />
        <Button title="medium" onPress={() => setSize('medium')} />
        <Button title="large" onPress={() => setSize('large')} />
        <Button title="xl" onPress={() => setSize('xlarge')} />
      </View>

      <H4>Randomize</H4>
      <Button
        title="Randomize Images"
        style={{ marginBottom: 30 }} // eslint-disable-line react-native/no-inline-styles
        onPress={() => setSeed(Math.random() * 100)}
      />
    </>
  );
}

storiesOf('ui-kit/Avatar/AvatarCloud', module)
  .add('default', () => <Examples />)
  .add('no image', () => (
    <AvatarCloud
      size={256}
      profiles={[
        { id: 1, firstName: 'C', lastName: 'V' },
        { id: 2, firstName: 'V', lastName: 'W' },
        { id: 3, firstName: 'M', lastName: 'N' },
        { id: 4, firstName: 'N', lastName: 'L' },
        { id: 5, firstName: 'A', lastName: 'S' },
        { id: 6, firstName: 'S', lastName: 'M' },
        { id: 7, firstName: 'D', lastName: 'W' },
        { id: 8, firstName: 'J', lastName: 'W' },
        { id: 9, firstName: 'A', lastName: 'A' },
        { id: 10, firstName: 'Z', lastName: 'Z' },
      ]}
    />
  ))
  .add('isLoading', () => (
    <AvatarCloud avatars={['', '', '']} primaryAvatar={''} isLoading />
  ))
  .add('primaryAvatar', () => (
    <>
      <AvatarCloud
        avatars={generateAvatars(2)}
        primaryAvatar={'https://picsum.photos/200'}
        size="xlarge"
      />
      <AvatarCloud
        avatars={generateAvatars(5)}
        primaryAvatar={'https://picsum.photos/200'}
        size="xlarge"
      />
      <AvatarCloud
        avatars={generateAvatars(8)}
        primaryAvatar={'https://picsum.photos/200'}
        size="xlarge"
      />
      <AvatarCloud
        avatars={generateAvatars(100)}
        primaryAvatar={'https://picsum.photos/200'}
        size="xlarge"
      />
    </>
  ))
  .add('more examples', () => (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      <AvatarCloud avatars={generateAvatars(2)} size="large" />
      <AvatarCloud avatars={generateAvatars(3)} size="large" />
      <AvatarCloud avatars={generateAvatars(4)} size="large" />
      <AvatarCloud avatars={generateAvatars(5)} size="large" />
      <AvatarCloud avatars={generateAvatars(6)} size="large" />
      <AvatarCloud avatars={generateAvatars(7)} size="large" />
      <AvatarCloud avatars={generateAvatars(8)} size="large" />
      <AvatarCloud avatars={generateAvatars(9)} size="large" />
      <AvatarCloud avatars={generateAvatars(10)} size="large" />
      <AvatarCloud avatars={generateAvatars(20)} size="large" />
      <AvatarCloud avatars={generateAvatars(40)} size="large" />
      <AvatarCloud avatars={generateAvatars(80)} size="large" />
    </View>
  ));
