import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import {
  ConnectStack,
  HomeStack,
  ProfileStack,
  SearchStack,
  SectionsStack,
} from './src/tabs';
import Article from './src/article';

export const TabStack = createBottomTabNavigator({
  Home: HomeStack,
  Sections: SectionsStack,
  Connect: ConnectStack,
  Search: SearchStack,
  Profile: ProfileStack,
});

export const RootStack = createStackNavigator(
  {
    Tab: TabStack,
    Article,
  },
  {
    initialRouteName: 'Tab',
    headerMode: 'none',
  }
);

/* eslint-disable */
export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
/* eslint-enable */
