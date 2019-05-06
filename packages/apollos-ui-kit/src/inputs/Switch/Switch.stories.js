import React from 'react';
import { storiesOf } from 'ApollosStorybook/native-storybook';



import FlexedView from '../../FlexedView';

import Switch from '.';

storiesOf('Inputs', module).add('Switch', () => (
  <FlexedView>
    <Switch label="Some label text" />
  </FlexedView>
));
