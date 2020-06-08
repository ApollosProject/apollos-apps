import React from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { storiesOf } from '@apollosproject/ui-storybook';
import { CenteredView } from '@apollosproject/ui-kit';

import PrayerCard from '../PrayerCard';
import PrayerSwiper from '.';

const PrayerScreen = (
  { children } // eslint-disable-line react/prop-types
) => (
  <TouchableWithoutFeedback
    onPress={() => Keyboard.dismiss()}
    style={{ flex: 1 }} // eslint-disable-line react-native/no-inline-styles
  >
    <CenteredView
      style={{ alignItems: 'stretch', backgroundColor: 'salmon' }} // eslint-disable-line
    >
      {children}
    </CenteredView>
  </TouchableWithoutFeedback>
);

storiesOf('ui-prayer/PrayerSwiper', module).add('example', () => (
  <PrayerSwiper>
    {(
      { swipeForward } //eslint-disable-line
    ) => (
      <>
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
        <PrayerScreen>
          <PrayerCard
            prayer={
              'For my 15+ year old dog as she makes her journey from this life. she has been a joy and a blessing to us since we adopted her 12 years ago. Thank you Lord for giving us such a sweet and loving companion.'
            }
            title={'Pray for Peter'}
          />
        </PrayerScreen>
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
        <PrayerScreen>
          <PrayerCard
            avatar={{
              uri: 'https://picsum.photos/400/400',
            }}
          />
        </PrayerScreen>
      </>
    )}
  </PrayerSwiper>
));
