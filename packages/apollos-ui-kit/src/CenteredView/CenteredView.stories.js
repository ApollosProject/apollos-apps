import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { H1 } from '../typography';

import CenteredView from '.';

storiesOf('ui-kit/CenteredView', module).add('Example', () => (
  <CenteredView>
    <H1>This text is in a CenteredView</H1>
  </CenteredView>
));
