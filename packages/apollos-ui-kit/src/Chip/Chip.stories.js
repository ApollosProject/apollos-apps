import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../CenteredView';

import ChipList from './List';
import Chip from '.';

storiesOf('ui-kit/Chip', module)
  .addDecorator((story) => <CenteredView>{story()}</CenteredView>)
  .add('default', () => (
    <Chip onPress={() => {}} title="I'm just a poor chip" />
  ))
  .add('With Icon', () => (
    <Chip onPress={() => {}} icon="close" title="I need no sympathy" />
  ))
  .add('Selected', () => <Chip onPress={() => {}} selected title="Easy come" />)
  .add('List', () => (
    <ChipList>
      <Chip onPress={() => {}} title="I'm just a poor chip" chipList />
      <Chip
        onPress={() => {}}
        icon="close"
        title="I need no sympathy"
        chipList
      />
      <Chip onPress={() => {}} selected title="Easy come" chipList />
      <Chip onPress={() => {}} icon="close" selected title="Easy go" chipList />
      <Chip onPress={() => {}} icon="arrow-up" title="Litte high" chipList />
      <Chip
        onPress={() => {}}
        type="secondary"
        icon="arrow-down"
        title="Litte low"
        chipList
      />
      <Chip title="📍💨?" chipList />
      <Chip selected title="¯\_(ツ)_/¯" chipList />
    </ChipList>
  ));
