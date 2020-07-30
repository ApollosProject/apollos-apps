import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../../CenteredView';
import PaddedView from '../../PaddedView';
import BackgroundView from '../../BackgroundView';

import ActionListItem from '.';

storiesOf('ActionList/ActionListItem', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>
        <PaddedView>{story()}</PaddedView>
      </CenteredView>
    </BackgroundView>
  ))
  .add('example', () => (
    <ActionListItem
      imageSource={'https://picsum.photos/600/400/?random'}
      label={'Boom'}
      onPress={() => {}}
      title={'Hello 1'}
    />
  ))
  .add('default', () => (
    <ActionListItem imageSource={'https://picsum.photos/600/400/?random'} />
  ))
  .add('label', () => (
    <ActionListItem
      onPress={() => {}}
      imageSource={'https://picsum.photos/600/400/?random'}
      label={'Boom'}
      title={'Hello 1'}
      relatedNodeId={'fakeID'}
    />
  ))
  .add('title', () => (
    <ActionListItem
      imageSource={'https://picsum.photos/600/400/?random'}
      title={'Hello 1'}
    />
  ))
  .add('event', () => (
    <ActionListItem imageSource={null} title={'Hello 1'} start={'11/02/1996'} />
  ))
  .add('onPress', () => (
    <ActionListItem
      imageSource={'https://picsum.photos/600/400/?random'}
      onPress={() => {}}
    />
  ));
