import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import LiveNowButton from '../../live';

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
      <View style={styles.container}>
        <LiveNowButton navigation={this.props.navigation} />
        <Text>Connect Screen</Text>
      </View>
    );
  }
}

ConnectScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export const ConnectStack = createStackNavigator(
  {
    Connect: ConnectScreen,
  },
  {
    initialRouteName: 'Connect',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default ConnectStack;
