import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ConnectScreen = () => (
  <View style={styles.container}>
    <Text>Connect Screen</Text>
  </View>
);

export const ConnectStack = createStackNavigator(
  {
    Connect: ConnectScreen,
  },
  {
    initialRouteName: 'Connect',
  }
);

export default ConnectScreen;
