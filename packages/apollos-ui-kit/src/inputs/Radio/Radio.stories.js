import React from 'react';
import { storiesOf } from '@storybook/react-native';

import FlexedView from '../../FlexedView';

import Radio, { RadioButton } from '.';

storiesOf('Choices', module).add('Radio', () => (
  <FlexedView>
    <Radio label="Choices">
      <RadioButton label="option 1" value="one" />
      <RadioButton label="option 2" value="two" />
    </Radio>
  </FlexedView>
));
