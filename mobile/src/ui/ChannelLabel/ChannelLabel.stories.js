import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import ChannelLabel from './';

storiesOf('ChannelLabel', module)
  .add('Default', () => {
    const centered = {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    };

    return (
      <View style={centered}>
        <ChannelLabel label={'Default'} />
      </View>
    );
  })
  .add('Skeleton', () => {
    const centered = {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    };

    return (
      <View style={centered}>
        <ChannelLabel label={'Default'} isLoading />
      </View>
    );
  })
  .add('Series', () => {
    const centered = {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    };

    return (
      <View style={centered}>
        <ChannelLabel label={'Series'} />
      </View>
    );
  })
  .add('Albums', () => {
    const centered = {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    };

    return (
      <View style={centered}>
        <ChannelLabel label={'Albums'} />
      </View>
    );
  })
  .add('Custom', () => {
    const centered = {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    };

    return (
      <View style={centered}>
        <ChannelLabel label={'Albums'} icon={'like-solid'} />
      </View>
    );
  })
  .add('Flexed', () => {
    const centered = {
      height: '100%',
    };

    return (
      <View style={centered}>
        <ChannelLabel label={'Albums'} icon={'arrow-back'} withFlex />
        <View style={{ flex: 3, backgroundColor: 'salmon' }} />
      </View>
    );
  });
