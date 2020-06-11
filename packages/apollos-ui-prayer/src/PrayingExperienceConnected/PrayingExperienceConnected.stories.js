import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';

import PrayerExperienceConnected from '.';

// note: if you want these stories to run, make sure to log into the app first!
// open the app store, login, then come back to this story.
// TODO: where do we put this instruction to be more easily seen?

storiesOf('ui-prayer/PrayerExperienceConnected', module).add('example', () => (
  <PrayerExperienceConnected id="PrayerListFeature:9724110384a5109532f35a4980ea9b77f2d199f4cb456bb8c8ea55a925cec739815c742a0c3ce42c726d35af507ce66e2e2a631c3b28a8ca52d3892b63fef178083cb2d10b100b68607aa5362263418b297450b10882570edf492f07a3037b58" />
));
