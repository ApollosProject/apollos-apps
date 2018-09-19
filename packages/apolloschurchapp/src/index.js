import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import { OneSignal } from 'react-native-onesignal';
// import { Sentry } from 'react-native-sentry';

import Providers from './Providers';
import ContentSingle from './content-single';
import Tabs from './tabs';
import Auth from './auth';

// Sentry.config(
//   'https://5908fa19ed37447f86b2717423cadec5:45dd3b58792b413cb67109c5e63a0bb7@sentry.io/1241658'
// ).install();

const AppStackNavigator = createStackNavigator(
  {
    Tabs,
    ContentSingle,
  },
  {
    initialRouteName: 'Tabs',
  }
);

const AppModalNavigator = createStackNavigator(
  {
    AppStackNavigator,
    Auth,
  },
  {
    initialRouteName: 'AppStackNavigator',
    mode: 'modal',
    headerMode: 'none',
  }
);

// OneSignal Key below should eventually be in the the env.

class OneSignalInit extends Component {
  componentWillMount() {
    OneSignal.init('b6e75a77-003f-4466-95ca-82cc5cdc407b', {
      kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }
}

const App = () => (
  <Providers>
    <AppModalNavigator />
    <OneSignalInit />
  </Providers>
);

export default App;
