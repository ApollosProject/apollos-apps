import React from 'react';
import { View, Text } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';

import CardTile from '.';

const containerStyles = {
  height: 300,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f7f7f7',
};

storiesOf('ui-kit/CardTile', module)
  .add('Default', () => (
    <View style={containerStyles}>
      <CardTile title={'Why Jesus is Timeless'} />
    </View>
  ))
  .add('Skeleton', () => (
    <View style={containerStyles}>
      <CardTile
        number={7}
        title={'Why Jesus is Timeless'}
        byLine={'Marty McFly'}
        date={'Sat Oct 26 1985 01:24:00 GMT+0008 (UTC)'}
        isLoading
      />
    </View>
  ))
  .add('With Number Box', () => (
    <View style={containerStyles}>
      <CardTile number={7} title={'Why Jesus is Timeless'} />
    </View>
  ))
  .add('With byLine', () => (
    <View style={containerStyles}>
      <CardTile
        number={7}
        title={'Why Jesus is Timeless'}
        byLine={'Marty McFly'}
      />
    </View>
  ))
  .add('With date', () => (
    <View style={containerStyles}>
      <CardTile
        number={7}
        title={'Why Jesus is Timeless'}
        byLine={'Marty McFly'}
        date={'Sat Oct 26 1985 01:24:00 GMT+0008 (UTC)'} // this snapshot will expire in a year
      />
    </View>
  ))
  .add('With Children', () => (
    <View style={containerStyles}>
      <CardTile>
        <Text>Biff Tannen was here</Text>
      </CardTile>
    </View>
  ));
