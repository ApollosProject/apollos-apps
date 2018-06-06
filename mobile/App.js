import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { TabStack } from './src/tabs';
import Article from './src/article';

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
