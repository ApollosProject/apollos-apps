import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import ChipList from './List';

import Chip from '.';

storiesOf('Chip', module)
  .add('default', () => (
    <Chip onPress={() => {}} title="I'm just a poor chip" />
  ))
  .add('With Icon', () => (
    <Chip onPress={() => {}} icon="close" title="I need no sympathy" />
  ))
  .add('Selected', () => <Chip onPress={() => {}} selected title="Easy come" />)
  .add('List', () => (
    <ChipList>
      <Chip onPress={() => {}} title="I'm just a poor chip" />
      <Chip onPress={() => {}} icon="close" title="I need no sympathy" />
      <Chip onPress={() => {}} selected title="Easy come" />
      <Chip onPress={() => {}} icon="close" selected title="Easy go" />
      <Chip onPress={() => {}} icon="arrow-up" title="Litte high" />
      <Chip
        onPress={() => {}}
        type="secondary"
        icon="arrow-down"
        title="Litte low"
      />
      <Chip title="📍💨?" />
      <Chip selected title="¯\_(ツ)_/¯" />
    </ChipList>
  ));
