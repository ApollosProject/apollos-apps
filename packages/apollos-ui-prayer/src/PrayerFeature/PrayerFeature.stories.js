import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { CenteredView } from '@apollosproject/ui-kit';

import PrayerFeature from '.';

storiesOf('ui-prayer/PrayerFeature', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: 'stretch' /* eslint-disable-line */ }}>
      {story()}
    </CenteredView>
  ))
  .add('example', () => (
    <PrayerFeature
      onPressAdd={() => {}}
      title={'Example title'}
      subtitle={'Custom Subtitle'}
    />
  ))
  .add('default', () => <PrayerFeature />)
  .add('isCard (false)', () => (
    <PrayerFeature isCard={false} title={'Example title'} />
  ))
  .add('isLoading', () => (
    <PrayerFeature isLoading title={'Example title'} isCard={false} />
  ))
  .add('onPressAdd', () => <PrayerFeature onPressAdd={() => {}} />)
  .add('title', () => <PrayerFeature />)
  .add('subtitle', () => <PrayerFeature subtitle={'Custom Subtitle'} />);
