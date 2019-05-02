import React from 'react';
import { storiesOf } from '@storybook/react-native';

import FlexedView from '../../FlexedView';

import Radio, { RadioButton } from '.';

storiesOf('inputs/Radio', module)
  .add('default', () => (
    <FlexedView>
      <Radio>
        <RadioButton label="option 1" value="one" />
        <RadioButton label="option 2" value="two" />
      </Radio>
    </FlexedView>
  ))
  .add('underline (false)', () => (
    <FlexedView>
      <Radio>
        <RadioButton label="option 1" value="one" underline={false} />
        <RadioButton label="option 2" value="two" underline={false} />
      </Radio>
    </FlexedView>
  ))
  .add('horizontal', () => (
    <FlexedView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <Radio style={{ flexDirection: 'row' }}>
        <RadioButton label="option 1" value="one" underline={false} />
        <RadioButton label="option 2" value="two" underline={false} />
      </Radio>
    </FlexedView>
  ))
  .add('error', () => (
    <FlexedView>
      <Radio error={'Danger Will Robinson'}>
        <RadioButton label="option 1" value="one" />
        <RadioButton label="option 2" value="two" />
      </Radio>
    </FlexedView>
  ));
