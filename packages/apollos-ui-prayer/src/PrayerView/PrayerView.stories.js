import React from 'react';
import { Text } from 'react-native';

import { storiesOf } from '@apollosproject/ui-storybook';

import PrayerCard from '../PrayerCard';

import PrayerView from '.';

storiesOf('ui-prayer/PrayerView', module)
  .add('example', () => (
    <PrayerView onPressSecondary={() => {}}>
      <PrayerCard
        avatar={{
          uri: 'https://picsum.photos/400/400',
        }}
        prayer={
          'For my 15+ year old dog as she makes her journey from this life. she has been a joy and a blessing to us since we adopted her 12 years ago. Thank you Lord for giving us such a sweet and loving companion.'
        }
        title={'Pray for Peter'}
      />
    </PrayerView>
  ))
  .add('default', () => <PrayerView />)
  .add('children', () => (
    <PrayerView>
      <Text>Hello World</Text>
    </PrayerView>
  ))
  .add('isLoading', () => (
    <PrayerView onPressSecondary={() => {}} isLoading>
      <PrayerCard />
    </PrayerView>
  ))
  .add('onPressSecondary', () => <PrayerView onPressSecondary={() => {}} />)
  .add('primaryActionText', () => (
    <PrayerView primaryActionText={'Custom primaryActionText'} />
  ))
  .add('secondaryActionText', () => (
    <PrayerView
      onPressSecondary={() => {}}
      secondaryActionText={'Custom secondaryActionText'}
    />
  ));
