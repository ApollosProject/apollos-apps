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

export class SectionsScreen extends React.Component {
  static navigationOptions = {
    title: 'Sections',
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Sections Screen</Text>
      </View>
    );
  }
}

export const SectionsStack = createStackNavigator(
  {
    Sections: SectionsScreen,
  },
  {
    initialRouteName: 'Sections',
  }
);

export default SectionsScreen;
