import React from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import { Sentry } from 'react-native-sentry';

import { BackgroundView, withTheme } from '@apollosproject/ui-kit';
import Passes from '@apollosproject/ui-passes';

import MediaPlayer from 'apolloschurchapp/src/ui/MediaPlayer';
import Auth from '@apollosproject/ui-auth';
// import AuthLoading from './auth-loading';
import Providers from './Providers';
import NavigationService from './NavigationService';
import ContentSingle from './content-single';
import Tabs from './tabs';
import PersonalDetails from './user-settings/PersonalDetails';
import ChangePassword from './user-settings/ChangePassword';
import Location from './user-settings/Locations';
import UserWebBrowser from './user-web-browser';
import Onboarding from './onboarding';

// Sentry.config(
//   'https://5908fa19ed37447f86b2717423cadec5:45dd3b58792b413cb67109c5e63a0bb7@sentry.io/1241658'
// ).install();

const getLoginState = gql`
  query {
    isLoggedIn @client(always: true)
  }
`;

const AppStatusBar = withTheme(({ theme }) => ({
  barStyle: 'dark-content',
  backgroundColor: theme.colors.paper,
}))(StatusBar);

const AuthNavigator = createStackNavigator(
  {
    Auth,
    Onboarding,
  },
  {
    initialRouteName: 'Auth',
    initialRouteParams: {
      onFinish: (props) => props.navigation.navigate('Onboarding'),
    },
    mode: 'modal',
    headerMode: 'screen',
  }
);

const AppNavigator = createStackNavigator(
  {
    Tabs,
    ContentSingle,
    Auth,
    PersonalDetails,
    ChangePassword,
    Location,
    Passes,
    UserWebBrowser,
    Onboarding,
  },
  {
    initialRouteName: 'Tabs',
    mode: 'modal',
    headerMode: 'screen',
  }
);

const App = () => (
  <Providers>
    <BackgroundView>
      <AppStatusBar barStyle="dark-content" />
      <Query query={getLoginState}>
        {({ data: { isLoggedIn = false } = {}, loading }) => {
          if (!loading) {
            if (isLoggedIn) {
              return (
                <AppNavigator
                  ref={(navigatorRef) => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                  }}
                />
              );
            }
            return (
              <AuthNavigator
                ref={(navigatorRef) => {
                  NavigationService.setTopLevelNavigator(navigatorRef);
                }}
              />
            );
          }
          return (
            <View>
              <ActivityIndicator />
            </View>
          );
        }}
      </Query>
      <MediaPlayer />
    </BackgroundView>
  </Providers>
);

export default App;
