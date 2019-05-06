import React from 'react';
import { storiesOf } from 'ApollosStorybook/native-storybook';



import { H1 } from '../typography';

import CenteredView from '.';

storiesOf('CenteredView', module).add('Example', () => (
  <CenteredView>
    <H1>This text is in a CenteredView</H1>
  </CenteredView>
));
