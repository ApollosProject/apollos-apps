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
    <PrayerFeature title={'Example title'} subtitle={'Custom Subtitle'} />
  ))
  .add('default', () => <PrayerFeature />)
  .add('title', () => <PrayerFeature title={'Example title'} />)
  .add('subtitle', () => <PrayerFeature subtitle={'Custom Subtitle'} />);
