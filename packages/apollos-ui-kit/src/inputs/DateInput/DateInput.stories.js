import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { View } from 'react-native';
import moment from 'moment';

import CenteredView from '../../CenteredView';
import PaddedView from '../../PaddedView';

import DateInput from '.';

storiesOf('ui-kit/Inputs/DateInput', module)
  .addDecorator((story) => (
    // eslint-disable-next-line react-native/no-inline-styles,react-native/no-color-literals
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <CenteredView>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <PaddedView style={{ alignSelf: 'stretch' }}>{story()}</PaddedView>
      </CenteredView>
    </View>
  ))
  .add('default', () => (
    <DateInput
      value={moment.utc('1/1/2015').toDate()}
      maximumDate={moment.utc('1/1/2015').toDate()}
    />
  ));
