import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import FlexedView from 'ui/FlexedView';

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

ConnectScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

const ConnectStack = createStackNavigator(
  {
    Connect: ConnectScreen,
  },
  {
    initialRouteName: 'Connect',
  }
);

export default ConnectStack;
