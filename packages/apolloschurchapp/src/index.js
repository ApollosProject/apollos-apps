import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';
// import { Sentry } from 'react-native-sentry';

import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import MediaPlayer from 'apolloschurchapp/src/ui/MediaPlayer';

import Providers from './Providers';
import NotificationsInit from './Notifications';
import ContentSingle from './content-single';
import Tabs from './tabs';
import Auth from './auth';

const AppNavigator = createStackNavigator(
  {
    Tabs,
    ContentSingle,
    Auth,
  },
  {
    initialRouteName: 'Tabs',
    mode: 'modal',
    headerMode: 'none',
  }
);

const App = () => (
  <Providers>
    <BackgroundView>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
      <NotificationsInit />
      <MediaPlayer />
    </BackgroundView>
  </Providers>
);

export default App;
