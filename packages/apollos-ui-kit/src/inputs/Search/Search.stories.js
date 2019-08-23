import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { View } from 'react-native';

import CenteredView from '../../CenteredView';
import PaddedView from '../../PaddedView';

import Search from '.';

storiesOf('ui-kit/Inputs/Search', module)
  .addDecorator((story) => (
    // eslint-disable-next-line react-native/no-inline-styles,react-native/no-color-literals
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <CenteredView>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <PaddedView style={{ alignSelf: 'stretch' }}>{story()}</PaddedView>
      </CenteredView>
    </View>
  ))
  .add('default', () => <Search />)
  .add('disabled', () => <Search disabled />)
  .add('placeholder', () => (
    <Search placeholder={'💥Custom Placeholder text💥'} />
  ));
