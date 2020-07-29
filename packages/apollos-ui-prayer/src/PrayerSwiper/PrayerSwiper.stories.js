import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';

import PrayerCard from '../PrayerCard';
import PrayerView from '../PrayerView';

import PrayerSwiper from '.';

storiesOf('ui-prayer/PrayerSwiper', module).add('example', () => (
  <PrayerSwiper>
    {(
      { swipeForward } //eslint-disable-line
    ) => (
      <>
        <PrayerView>
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
        <PrayerView>
          <PrayerCard
            prayer={
              'For my 15+ year old dog as she makes her journey from this life. she has been a joy and a blessing to us since we adopted her 12 years ago. Thank you Lord for giving us such a sweet and loving companion.'
            }
            title={'Pray for Peter'}
          />
        </PrayerView>
        <PrayerView>
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
        <PrayerView>
          <PrayerCard
            avatar={{
              uri: 'https://picsum.photos/400/400',
            }}
          />
        </PrayerView>
      </>
    )}
  </PrayerSwiper>
));
