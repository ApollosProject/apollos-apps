import React from 'react';
import { View, Text } from 'react-native';
import Swiper from 'react-native-swiper';

const Onboarding = () => (
  <Swiper loop={false} scrollEnabled={false} showsButtons>
    <View style={{ flex: 1, backgroundColor: 'salmon' }}>
      <Text>Hello World 1</Text>
    </View>
    <View style={{ flex: 1, backgroundColor: 'cyan' }}>
      <Text>Hello World 2</Text>
    </View>
    <View style={{ flex: 1, backgroundColor: 'lightgreen' }}>
      <Text>Hello World 3</Text>
    </View>
  </Swiper>
);

export default Onboarding;
