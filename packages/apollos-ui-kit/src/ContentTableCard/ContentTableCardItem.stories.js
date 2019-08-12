import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../CenteredView';
import PaddedView from '../PaddedView';
import BackgroundView from '../BackgroundView';

import ContentTableCardItem from './ContentTableCardItem';

storiesOf('ContentTableCardItem', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>
        <PaddedView>{story()}</PaddedView>
      </CenteredView>
    </BackgroundView>
  ))
  .add('title', () => (
    <ContentTableCardItem
      onPress={() => {}}
      imageSource={'https://picsum.photos/600/400/?random'}
      title={'Hello 1'}
      id={'fakeID'}
    />
  ))
  .add('label', () => (
    <ContentTableCardItem
      onPress={() => {}}
      imageSource={'https://picsum.photos/600/400/?random'}
      label={'Boom'}
      title={'Hello 1'}
      id={'fakeID'}
    />
  ));
