import React from 'react';
import { Alert } from 'react-native';

import { storiesOf } from '@apollosproject/ui-storybook';
import { ThemeMixin } from '@apollosproject/ui-kit';

import PrayerExperience from './PrayerExperience';

// note: if you want these stories to run, make sure to log into the app first!
// open the app store, login, then come back to this story.
// TODO: where do we put this instruction to be more easily seen?

const prayers = [
  {
    id: 'PrayerRequest:1',
    text: 'This is a prayer!',
    isPrayed: false,
    requestor: {
      id: 'Person:1',
      nickName: 'John',
      firstName: 'John',
      photo: {
        uri: 'https://picsum.photos/id/237/400/400',
      },
    },
  },
  {
    id: 'PrayerRequest:2',
    text: 'This is a prayer!',
    isPrayed: false,
    requestor: {
      id: 'Person:1',
      nickName: 'Sara',
      firstName: 'Sara',
      photo: {
        uri: 'https://picsum.photos/id/984/400/400',
      },
    },
  },
  {
    id: 'PrayerRequest:3',
    text: 'This is a prayer!',
    isPrayed: false,
    requestor: {
      id: 'Person:1',
      nickName: 'Paul',
      firstName: 'Paul',
      photo: {
        uri: 'https://picsum.photos/id/580/400/400',
      },
    },
  },
];

storiesOf('ui-prayer/PrayerExperience', module)
  .add('example', () => (
    <PrayerExperience
      onFinish={() => Alert.alert('Finished!')}
      primaryAvatar={{
        uri: 'https://picsum.photos/id/158/400/400',
      }}
      prayers={prayers}
      track={() => {}}
    />
  ))
  .add('dark theme', () => (
    <ThemeMixin mixin={{ type: 'dark' }}>
      <PrayerExperience
        onFinish={() => Alert.alert('Finished!')}
        primaryAvatar={{
          uri: 'https://picsum.photos/id/158/400/400',
        }}
        prayers={prayers}
        track={() => {}}
      />
    </ThemeMixin>
  ))
  .add('willShowOnboarding', () => (
    <PrayerExperience
      onFinish={() => Alert.alert('Finished!')}
      primaryAvatar={{
        uri: 'https://picsum.photos/id/158/400/400',
      }}
      prayers={prayers}
      track={() => {}}
      willShowOnboarding
    />
  ));
