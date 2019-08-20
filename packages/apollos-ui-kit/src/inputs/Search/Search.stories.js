import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../../CenteredView';
import PaddedView from '../../PaddedView';

import Search from '.';

storiesOf('ui-kit/Inputs/Search', module)
  .addDecorator((story) => (
    <CenteredView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <PaddedView style={{ alignSelf: 'stretch' }}>{story()}</PaddedView>
    </CenteredView>
  ))
  .add('default', () => <Search />)
  .add('disabled', () => <Search disabled />)
  .add('placeholder', () => (
    <Search placeholder={'💥Custom Placeholder text💥'} />
  ));
