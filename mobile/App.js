import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';
import ContentSingle from 'content-single';
import { ThemeProvider } from 'ui/theme';
import Tabs from 'tabs';
import client from 'client';
import Live from 'live';

export const AppNavigator = createStackNavigator(
  {
    Tabs,
    ContentSingle,
    Live,
  },
  {
    initialRouteName: 'Tabs',
  }
);

const App = () => (
  <ApolloProvider client={client}>
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  </ApolloProvider>
);

export default App;
