import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { CenteredView, PaddedView } from '@apollosproject/ui-kit';

import PrayerInput from '.';

storiesOf('ui-prayer/PrayerInput', module)
  .addDecorator((story) => (
    <CenteredView
      style={{ alignItems: 'stretch' }} // eslint-disable-line
    >
      <PaddedView>{story()}</PaddedView>
    </CenteredView>
  ))
  .add('default', () => <PrayerInput />);
