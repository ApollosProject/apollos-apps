import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { get } from 'lodash';
import { storiesOf } from '@storybook/react-native';

import CardTile from 'ui/CardTile';

import HorizontalTileFeed from './';

const tileData = [
  {
    id: 'fakeId0',
    title: 'Why Jesus is Timeless',
    meta: {
      date: 'Sat Oct 26 1985 01:24:00 GMT+0008 (UTC)', // this snapshot will expire in a year
    },
    content: {
      speaker: 'Marty McFly',
    },
  },
  {
    id: 'fakeId1',
    title: 'Tall Hat Tales',
    meta: {
      date: 'Sat Oct 26 1985 01:24:00 GMT+0008 (UTC)', // this snapshot will expire in a year
    },
    content: {
      speaker: 'A-bro-ham Lincoln',
    },
  },
];

const containerStyles = {
  height: 300,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f7f7f7',
};

const renderCardTile = (
  { item, index } //eslint-disable-line
) => (
  <TouchableWithoutFeedback onPress={() => this.props.onPressItem({ ...item })}>
    <CardTile
      number={index + 1}
      title={item.title}
      isLoading={item.isLoading}
    />
  </TouchableWithoutFeedback>
);

storiesOf('HorizontalTileFeed', module).add('Default', () => (
  <View style={containerStyles}>
    <HorizontalTileFeed content={tileData} renderItem={renderCardTile} />
  </View>
));
