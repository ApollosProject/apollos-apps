import React from 'react';
import { storiesOf } from '@storybook/react-native';

import FlexedView from '../../FlexedView';

import Radio, { RadioButton } from '.';

storiesOf('Choices', module).add('Radio', () => (
  <FlexedView>
    <Radio label="Choices">
      <RadioButton Label="option 1" value="one" />
      <RadioButton Label="option 2" value="two" />
    </Radio>
  </FlexedView>
));
