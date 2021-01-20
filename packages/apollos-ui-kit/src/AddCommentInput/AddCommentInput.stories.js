import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { View } from 'react-native';

import AddCommentInput from './AddCommentInput';

storiesOf('ui-kit/AddCommentInput', module).add('default', () => (
  <View style={{ justifyContent: 'flex-end', flex: 1 }}>
    <AddCommentInput />
  </View>
));
