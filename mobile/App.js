import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';
import ArticleSingle from 'articles/Single';
import ContentFeed from 'content/Feed';
import ContentSingle from 'content/Single';
import { ThemeProvider } from 'ui/theme';
import { TabStack } from 'tabs';
import client from 'client';
import LiveNowModal from 'live/liveModal';

import { Sentry } from 'react-native-sentry';

Sentry.config('https://5908fa19ed37447f86b2717423cadec5:45dd3b58792b413cb67109c5e63a0bb7@sentry.io/1241658').install();


export const RootStack = createStackNavigator(
  {
    Tab: TabStack,
    ArticleSingle,
    ContentFeed,
    ContentSingle,
    LiveNowModal,
  },
  {
    mode: 'modal',
    initialRouteName: 'Tab',
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
