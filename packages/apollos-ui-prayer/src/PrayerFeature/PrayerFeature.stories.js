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

const prayers = avatars.map((avatar, i) => ({
  id: `prayer-${i}`,
  requestor: {
    photo: avatar,
  },
}));

storiesOf('ui-prayer/PrayerFeature', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: 'stretch' /* eslint-disable-line */ }}>
      {story()}
    </CenteredView>
  ))
  .add('example', () => (
    <PrayerFeature
      prayers={prayers}
      onPressAdd={() => {}}
      title={'Example title'}
      subtitle={'Custom Subtitle'}
    />
  ))
  .add('default', () => <PrayerFeature prayers={prayers} />)
  .add('isCard (false)', () => (
    <PrayerFeature prayers={prayers} isCard={false} title={'Example title'} />
  ))
  .add('isLoading', () => (
    <PrayerFeature
      prayers={[{}, {}, {}, {}, {}, {}]}
      isLoading
      title={'Example title'}
      isCard={false}
    />
  ))
  .add('onPressAdd', () => (
    <PrayerFeature prayers={prayers} onPressAdd={() => {}} />
  ))
  .add('title', () => (
    <PrayerFeature prayers={prayers} title={'Example title'} />
  ))
  .add('subtitle', () => (
    <PrayerFeature prayers={prayers} subtitle={'Custom Subtitle'} />
  ));
