import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { H1 } from '../typography';

import CenteredView from '.';

storiesOf('CenteredView', module).add('Example', () => (
  <CenteredView>
    <H1>This text is in a CenteredView</H1>
  </CenteredView>
));
