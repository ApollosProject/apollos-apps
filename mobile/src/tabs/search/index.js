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

const SearchScreen = () => (
  <View style={styles.container}>
    <Text>Search Screen</Text>
  </View>
);

export const SearchStack = createStackNavigator(
  {
    Search: SearchScreen,
  },
  {
    initialRouteName: 'Search',
  }
);

export default SearchScreen;
