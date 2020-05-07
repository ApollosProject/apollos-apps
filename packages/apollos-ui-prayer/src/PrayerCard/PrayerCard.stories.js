import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { CenteredView } from '@apollosproject/ui-kit';

import PrayerCard from '.';

storiesOf('ui-prayer/PrayerCard', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView> // eslint-disable-line react-native/no-inline-styles
  ))
  .add('example', () => (
    <PrayerCard
      avatar={{
        uri: 'https://picsum.photos/400/400',
      }}
    />
  ));
