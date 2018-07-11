import React from 'react';
import { createStackNavigator } from 'react-navigation';

import ContentFeed from 'content-feed';
import ContentSingle from 'content-single';
import { ThemeProvider } from 'ui/theme';
import Tabs from 'tabs';
import ClientProvider from 'client';
import Auth from 'auth';
import Live from 'live';

const AppNavigator = createStackNavigator(
  {
    Tabs,
    ContentFeed,
    ContentSingle,
    Auth,
    Live,
  },
  {
    initialRouteName: 'Tabs',
  }
);

const App = () => (
  <ClientProvider>
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  </ClientProvider>
);

export default App;
