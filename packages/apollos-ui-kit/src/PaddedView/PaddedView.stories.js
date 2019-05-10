import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { H1 } from '../typography';

import PaddedView from '.';

storiesOf('ui-kit/PaddedView', module).add('Example', () => (
  <PaddedView>
    <H1>This text is in a PaddedView</H1>
  </PaddedView>
));
