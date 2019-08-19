import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import PaddedView from '../../PaddedView';
import CenteredView from '../../CenteredView';

import Search from '.';

storiesOf('ui-kit/Inputs', module)
  .addDecorator((story) => (
    <CenteredView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <PaddedView style={{ alignSelf: 'stretch' }}>{story()}</PaddedView>
    </CenteredView>
  ))
  .add('Search', () => <Search />);
