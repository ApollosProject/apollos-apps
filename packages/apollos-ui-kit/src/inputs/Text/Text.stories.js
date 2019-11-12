import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';

import Icon from '../../Icon';
import FlexedView from '../../FlexedView';

import styled from '../../styled';

import Text from '.';

const PlaceholderBox = styled(() => ({
  width: 50,
  height: 50,
  backgroundColor: 'red',
}))(View);

storiesOf('ui-kit/Inputs', module).add('Text', () => (
  <FlexedView>
    <Text editable label="Some label text" placeholder="Some placeholder" />
    <Text
      editable
      type="password"
      label="Password"
      placeholder="Some placeholder"
      suffix={<Icon name="lock" size={18} />}
    />
    <Text editable type="email" label="Email" placeholder="Some placeholder" />
    <Text
      editable
      type="numeric"
      label="Numeric"
      placeholder="Some placeholder"
    />
    <Text
      editable
      type="phone"
      label="Phone Number"
      placeholder="Some placeholder"
      underline={false}
    />

    <Text
      editable
      label="Use Prefix to Extend Design"
      placeholder="Some placeholder"
      prefix={<PlaceholderBox />}
    />
  </FlexedView>
));
