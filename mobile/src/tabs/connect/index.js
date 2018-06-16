import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import BackgroundView from 'ui/BackgroundView';
import tabBarIcon from '../tabBarIcon';

export class ConnectScreen extends React.Component {
  static navigationOptions = {
    title: 'Connect',
  };
  render() {
    return (
      <BackgroundView>
        <Text>Connect Screen</Text>
      </BackgroundView>
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
