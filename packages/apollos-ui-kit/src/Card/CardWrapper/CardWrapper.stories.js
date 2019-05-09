import React from 'react';
import { View, Text } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';

import CardWrapper from '.';

storiesOf('ui-kit/Card/CardWrapper', module)
  .add('Default', () => {
    const centered = {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#f7f7f7',
    };

    const cardDimensions = {
      height: 400,
      width: '92%',
    };

    return (
      <View style={centered}>
        <CardWrapper style={cardDimensions}>
          <Text>Boom!</Text>
        </CardWrapper>
      </View>
    );
  })
  .add('With backgroundColor', () => {
    const centered = {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: '#f7f7f7',
    };

    const cardDimensions = {
      height: 400,
      width: '92%',
    };

    return (
      <View style={centered}>
        <CardWrapper style={cardDimensions} cardColor={'salmon'}>
          <Text>Boom!</Text>
        </CardWrapper>
      </View>
    );
  });
