import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import FlexedView from '../../FlexedView';

import Switch from '.';

storiesOf('ui-kit/Inputs', module).add('Switch', () => (
  <FlexedView>
    <Switch label="Some label text" />
  </FlexedView>
));
