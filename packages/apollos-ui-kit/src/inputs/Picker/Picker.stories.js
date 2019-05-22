import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import FlexedView from '../../FlexedView';

import Picker, { Item } from '.';

storiesOf('ui-kit/Inputs', module).add('Picker', () => (
  <FlexedView>
    <Picker placeholder="Select a language..." label="Languages">
      <Item label="Java" value="java" />
      <Item label="JavaScript" value="js" />
    </Picker>
  </FlexedView>
));
