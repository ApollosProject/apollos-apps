import React from 'react';
import { StatusBar, Animated, Easing } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { FluidNavigator } from 'react-navigation-fluid-transitions';
// import { Sentry } from 'react-native-sentry';

import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import MediaPlayer from 'apolloschurchapp/src/ui/MediaPlayer';

import Providers from './Providers';
import NotificationsInit from './Notifications';
import ContentSingle from './content-single';
import Tabs from './tabs';
import Auth from './auth';

// Sentry.config(
//   'https://5908fa19ed37447f86b2717423cadec5:45dd3b58792b413cb67109c5e63a0bb7@sentry.io/1241658'
// ).install();

const AppFluidNavigator = FluidNavigator(
  {
    Tabs,
    ContentSingle,
  },
  {
    initialRouteName: 'Tabs',
    mode: 'modal',
    navigationOptions: { gesturesEnabled: true },
    transitionConfig: {
      duration: 250,
    },
  }
);

const AppModalNavigator = createStackNavigator(
  {
    AppFluidNavigator,
    Auth,
  },
  {
    initialRouteName: 'AppFluidNavigator',
    mode: 'modal',
    headerMode: 'none',
  }
);

const App = () => (
  <Providers>
    <BackgroundView>
      <StatusBar barStyle="dark-content" />
      <AppModalNavigator />
      <NotificationsInit />
      <MediaPlayer />
    </BackgroundView>
  </Providers>
);

export default App;
