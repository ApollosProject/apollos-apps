import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import FlexedView from 'ui/FlexedView';
import tabBarIcon from '../tabBarIcon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export class ConnectScreen extends React.Component {
  static navigationOptions = {
    title: 'Connect',
  };
  render() {
    return (
      <FlexedView>
        <View style={styles.container}>
          <Text>Connect Screen</Text>
        </View>
      </FlexedView>
    );
  }
}

const ConnectStack = createStackNavigator(
  {
    Connect: ConnectScreen,
  },
  {
    initialRouteName: 'Connect',
  }
);

ConnectStack.navigationOptions = {
  tabBarIcon: tabBarIcon('profile'),
};

export default ConnectStack;
