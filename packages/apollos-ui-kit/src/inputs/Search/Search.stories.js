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
  ))
  .add('screenBackgroundColor', () => (
    // you only need this if you are rendering `Search` on a color other than theme.colors.background.paper.
    <Search screenBackgroundColor={'salmon'} />
  ))
  .add('cancelButtonText', () => <Search cancelButtonText={'Boom'} />);
