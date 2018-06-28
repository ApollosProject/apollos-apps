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

const loadingStateObject = {
  id: 'fakeId0',
  title: '',
  meta: {
    date: '',
  },
  content: {
    speaker: '',
  },
  isLoading: true,
};

const containerStyles = {
  height: 300,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f7f7f7',
};

const renderCardTile = (
  { item, index } //eslint-disable-line
) => (
  <CardTile number={index + 1} title={item.title} isLoading={item.isLoading} />
);

storiesOf('HorizontalTileFeed', module)
  .add('Default', () => (
    <View style={containerStyles}>
      <HorizontalTileFeed
        content={tileData}
        renderItem={renderCardTile}
        loadingStateObject={loadingStateObject}
      />
    </View>
  ))
  .add('Skeleton', () => (
    <View style={containerStyles}>
      <HorizontalTileFeed
        content={{}}
        renderItem={renderCardTile}
        loadingStateObject={loadingStateObject}
        isLoading
      />
    </View>
  ));
