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
  .add('default', () => <PrayerInput />)
  .add('maxLength: 12', () => <PrayerInput maxLength={12} />)
  .add('maxLengthWarning: 12', () => <PrayerInput maxLengthWarning={270} />)
  .add('prompt', () => <PrayerInput prompt={'Boom'} />);
