import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';
import ArticleSingle from 'articles/Single';
import { ThemeProvider } from 'ui/theme';
import { TabStack } from 'tabs';
import client from 'client';

export const RootStack = createStackNavigator(
  {
    Tab: TabStack,
    ArticleSingle,
  },
  {
    initialRouteName: 'Tab',
    headerMode: 'none',
  }
);

/* eslint-disable */
export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ThemeProvider>
          <RootStack />
        </ThemeProvider>
      </ApolloProvider>
    );
  }
}
/* eslint-enable */
