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

const ProfileScreen = () => (
  <View style={styles.container}>
    <Text>Profile Screen</Text>
  </View>
);

export const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  {
    initialRouteName: 'Profile',
  }
);

export default ProfileScreen;
