import React from 'react';
import { storiesOf } from 'ApollosStorybook/native-storybook';



import FlexedView from '../../FlexedView';

import Picker, { Item } from '.';

storiesOf('Inputs', module).add('Picker', () => (
  <FlexedView>
    <Picker placeholder="Select a language..." label="Languages">
      <Item label="Java" value="java" />
      <Item label="JavaScript" value="js" />
    </Picker>
  </FlexedView>
));
