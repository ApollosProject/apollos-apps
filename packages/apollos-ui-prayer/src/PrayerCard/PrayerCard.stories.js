import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { CenteredView } from '@apollosproject/ui-kit';

import PrayerCard from '.';

storiesOf('ui-prayer/PrayerCard', module)
  .addDecorator((story) => (
    <CenteredView
      style={{ alignItems: 'stretch', backgroundColor: 'salmon' }} // eslint-disable-line
    >
      {story()}
    </CenteredView>
  ))
  .add('example – prayer', () => (
    <PrayerCard
      avatar={{
        uri: 'https://picsum.photos/400/400',
      }}
      prayer={
        'For my 15+ year old dog as she makes her journey from this life. she has been a joy and a blessing to us since we adopted her 12 years ago. Thank you Lord for giving us such a sweet and loving companion.'
      }
      title={'Pray for Peter'}
    />
  ))
  .add('example – prayer input', () => (
    <PrayerCard
      avatar={{
        uri: 'https://picsum.photos/400/400',
      }}
    />
  ))
  .add('default', () => <PrayerCard />)
  .add('avatar', () => (
    <PrayerCard
      avatar={{
        uri: 'https://picsum.photos/400/400',
      }}
    />
  ))
  .add('cardColor', () => <PrayerCard cardColor={'salmon'} />)
  .add('isLoading', () => <PrayerCard isLoading />)
  .add('prayer', () => (
    <PrayerCard
      prayer={
        'For my 15+ year old dog as she makes her journey from this life. she has been a joy and a blessing to us since we adopted her 12 years ago. Thank you Lord for giving us such a sweet and loving companion.'
      }
    />
  ))
  .add('title', () => <PrayerCard title={'Custom title'} />);
