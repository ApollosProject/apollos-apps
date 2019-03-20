import React from 'react';
import { storiesOf } from '@storybook/react-native';

import FlexedView from '../../FlexedView';

import Radio, { RadioButton } from '.';

storiesOf('inputs/Radio', module).add('default', () => (
  <FlexedView>
    <Radio>
      <RadioButton label="option 1" value="one" />
      <RadioButton label="option 2" value="two" />
    </Radio>
  </FlexedView>
));
storiesOf('inputs/Radio', module).add('noUnderline', () => (
  <FlexedView>
    <Radio>
      <RadioButton label="option 1" value="one" underline={false} />
      <RadioButton label="option 2" value="two" underline={false} />
    </Radio>
  </FlexedView>
));
storiesOf('inputs/Radio', module).add('horizontal', () => (
  <FlexedView>
    <Radio style={{ flexDirection: 'row' }}>
      <RadioButton label="option 1" value="one" underline={false} />
      <RadioButton label="option 2" value="two" underline={false} />
    </Radio>
  </FlexedView>
));
