import { StatusBar } from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import 'react-native-gesture-handler'; // required for react-navigation
import { enableScreens } from 'react-native-screens';

import ApollosConfig from '@apollosproject/config';
import {
  BackgroundView,
  useTheme,
  NavigationService,
  Providers as ThemeProvider,
} from '@apollosproject/ui-kit';
import Passes from '@apollosproject/ui-passes';
import { MapViewConnected as Location } from '@apollosproject/ui-mapview';

import {
  ContentSingleConnected,
  ContentFeedConnected,
  PersonFollowingConnected,
  SearchScreenConnected,
  ScriptureScreenConnected,
} from '@apollosproject/ui-connected';
import Providers from 'Providers';
import Auth, { ProtectedRoute } from 'auth';
import { Onboarding } from 'onboarding';
import Settings from 'settings';
import Tabs from 'tabs';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: ApollosConfig.SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

enableScreens(); // improves performance for react-navigation

const AppStatusBar = () => {
  const theme = useTheme();
  return (
    <StatusBar
      barStyle={theme.barStyle}
      backgroundColor={theme.colors.background.paper}
    />
  );
};

const ThemedNavigationContainer = ({ children }) => {
  const theme = useTheme();
  return (
    <NavigationContainer
      ref={NavigationService.setTopLevelNavigator}
      onReady={NavigationService.setIsReady}
      theme={{
        ...(theme.type === 'dark' ? DarkTheme : DefaultTheme),
        dark: theme.type === 'dark',
        colors: {
          ...(theme.type === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
          primary: theme.colors.secondary,
          background: theme.colors.background.screen,
          card: theme.colors.background.paper,
          text: theme.colors.text.primary,
        },
      }}
    >
      {children}
    </NavigationContainer>
  );
};

const { Navigator, Screen } = createNativeStackNavigator();

const App = () => (
  <ThemeProvider theme={ApollosConfig.THEME}>
    <BackgroundView>
      <AppStatusBar />
      <ThemedNavigationContainer>
        <Providers>
          <Navigator
            screenOptions={{ headerShown: false, stackPresentation: 'modal' }}
          >
            <Screen name="ProtectedRoute" component={ProtectedRoute} />
            <Screen
              name="Tabs"
              component={Tabs}
              options={{
                gestureEnabled: false,
                stackPresentation: 'push',
              }}
            />
            <Screen
              name="ContentSingle"
              component={ContentSingleConnected}
              options={{
                title: 'Content',
                stackPresentation: 'fullScreenModal',
              }}
            />
            <Screen
              component={ContentFeedConnected}
              name="ContentFeed"
              options={({ route }) => ({
                title: route.params.itemTitle || 'Content Feed',
                stackPresentation: 'push',
              })}
            />
            <Screen
              name="Auth"
              component={Auth}
              options={{
                gestureEnabled: false,
                stackPresentation: 'push',
              }}
            />
            <Screen
              name="Location"
              component={Location}
              options={{ title: 'Campuses' }}
            />
            <Screen
              name="Passes"
              component={Passes}
              options={{ title: 'Check-In Pass' }}
            />
            <Screen
              name="Onboarding"
              component={Onboarding}
              options={{
                gestureEnabled: false,
                stackPresentation: 'push',
              }}
            />
            <Screen
              name="Scripture"
              component={ScriptureScreenConnected}
              options={{
                gestureEnabled: true,
                stackPresentation: 'modal',
              }}
            />
            <Screen name="Search" component={SearchScreenConnected} />
            <Screen name="UserSettingsNavigator" component={Settings} />
            <Screen name="Following" component={PersonFollowingConnected} />
          </Navigator>
        </Providers>
      </ThemedNavigationContainer>
    </BackgroundView>
  </ThemeProvider>
);

export default Sentry.wrap(App);
