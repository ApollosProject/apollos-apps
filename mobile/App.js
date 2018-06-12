import React from 'react';
import { createStackNavigator } from 'react-navigation';
import ArticleSingle from 'articles/Single';
import { TabStack } from 'tabs';
import ModalScreen from 'live/liveModal';

export const RootStack = createStackNavigator(
  {
    Tab: TabStack,
    ArticleSingle,
    MyModal: {
      screen: ModalScreen,
    },
  },
  {
    mode: 'modal',
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
