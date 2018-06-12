import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';
import ArticleSingle from 'articles/Single';
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
        <RootStack />
      </ApolloProvider>
    );
  }
}
/* eslint-enable */
