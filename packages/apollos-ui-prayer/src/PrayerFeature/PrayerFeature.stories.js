import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { CenteredView } from '@apollosproject/ui-kit';

import PrayerFeature from '.';

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

storiesOf('ui-prayer/PrayerFeature', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: 'stretch' /* eslint-disable-line */ }}>
      {story()}
    </CenteredView>
  ))
  .add('example', () => (
    <PrayerFeature
      avatars={avatars}
      onPressAdd={() => {}}
      title={'Example title'}
      subtitle={'Custom Subtitle'}
    />
  ))
  .add('default', () => <PrayerFeature avatars={avatars} />)
  .add('isCard (false)', () => (
    <PrayerFeature avatars={avatars} isCard={false} title={'Example title'} />
  ))
  .add('isLoading', () => (
    <PrayerFeature
      avatars={['', '', '', '', '', '', '', '']}
      isLoading
      title={'Example title'}
      isCard={false}
    />
  ))
  .add('onPressAdd', () => (
    <PrayerFeature avatars={avatars} onPressAdd={() => {}} />
  ))
  .add('title', () => (
    <PrayerFeature avatars={avatars} title={'Example title'} />
  ))
  .add('subtitle', () => (
    <PrayerFeature avatars={avatars} subtitle={'Custom Subtitle'} />
  ));
