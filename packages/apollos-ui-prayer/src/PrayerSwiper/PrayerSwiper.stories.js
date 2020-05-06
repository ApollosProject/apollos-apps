import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { CenteredView, H1 } from '@apollosproject/ui-kit';

import PrayerSwiper from '.';

storiesOf('ui-prayer/PrayerSwiper', module).add('example', () => (
  <PrayerSwiper>
    {(
      { swipeForward } //eslint-disable-line
    ) => (
      <>
        <CenteredView>
          <H1>Hello?</H1>
        </CenteredView>
        <CenteredView>
          <H1>Hi!</H1>
        </CenteredView>
        <CenteredView>
          <H1>{`Well isn't this awkward.`}</H1>
        </CenteredView>
      </>
    )}
  </PrayerSwiper>
));
