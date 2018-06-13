import React from 'react';
import { createStackNavigator } from 'react-navigation';
import ArticleSingle from 'articles/Single';
import { TabStack } from 'tabs';
import LiveNowModalScreen from 'live/liveModal';

export const RootStack = createStackNavigator(
  {
    Tab: TabStack,
    ArticleSingle,
    LiveNowModal: {
      screen: LiveNowModalScreen,
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
