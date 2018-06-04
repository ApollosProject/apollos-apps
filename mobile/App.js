import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import {
  ConnectStack,
  ProfileStack,
  SearchStack,
  SectionsStack,
} from './src/tabs';
import Article from './src/article';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>This is the home screen</Text>
        <Button
          title="Go to Article"
          onPress={() => this.props.navigation.navigate('Article')}
        />
      </View>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Article,
  },
  {
    initialRouteName: 'Home',
  }
);

export const RootStack = createBottomTabNavigator(
  {
    Home: HomeStack,
    Sections: SectionsStack,
    Connect: ConnectStack,
    Search: SearchStack,
    Profile: ProfileStack,
  },
  {
    initialRouteName: 'Home',
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

/* eslint-disable */
export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
/* eslint-enable */
