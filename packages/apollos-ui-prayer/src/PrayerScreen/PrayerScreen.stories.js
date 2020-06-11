import React from 'react';
import { Text } from 'react-native';

import { storiesOf } from '@apollosproject/ui-storybook';

import PrayerCard from '../PrayerCard';

import PrayerScreen from '.';

storiesOf('ui-prayer/PrayerScreen', module)
  .add('example', () => (
    <PrayerScreen>
      <PrayerCard
        avatar={{
          uri: 'https://picsum.photos/400/400',
        }}
        prayer={
          'For my 15+ year old dog as she makes her journey from this life. she has been a joy and a blessing to us since we adopted her 12 years ago. Thank you Lord for giving us such a sweet and loving companion.'
        }
        title={'Pray for Peter'}
      />
    </PrayerScreen>
  ))
  .add('default', () => <PrayerScreen />)
  .add('children', () => (
    <PrayerScreen>
      <Text>Hello World</Text>
    </PrayerScreen>
  ))
  .add('primaryActionText', () => (
    <PrayerScreen primaryActionText={'Custom primaryActionText'} />
  ));
