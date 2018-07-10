import React from 'react';
import { createStackNavigator } from 'react-navigation';
import ArticleSingle from 'articles/Single';
import ContentFeed from 'content/Feed';
import ContentSingle from 'content/Single';
import { ThemeProvider } from 'ui/theme';
import { TabStack } from 'tabs';
import ClientProvider from 'client';
import LiveNowModal from 'live/liveModal';
import Auth from 'auth';

export const RootStack = createStackNavigator(
  {
    Tab: TabStack,
    ArticleSingle,
    ContentFeed,
    ContentSingle,
    LiveNowModal,
    Auth,
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
      <ClientProvider>
        <ThemeProvider>
          <RootStack />
        </ThemeProvider>
      </ClientProvider>
    );
  }
}
/* eslint-enable */
