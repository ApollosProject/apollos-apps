import React from 'react';
import { Providers, BackgroundView } from '@apollosproject/ui-kit';
import { LiveProvider } from '@apollosproject/ui-connected';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ClientProvider, { client } from './client';
import customTheme, { customIcons } from './theme';

const Stack = createStackNavigator();

const screenOptions = { header: () => null };

const decorator = (story) => {
  const Screen = () => <BackgroundView>{story()}</BackgroundView>;
  return (
    <NavigationContainer independent>
      <ClientProvider>
        <LiveProvider>
          <Providers themeInput={customTheme} iconInput={customIcons}>
            <Stack.Navigator>
              <Stack.Screen
                name="RootScreen"
                component={Screen}
                options={screenOptions}
              />
            </Stack.Navigator>
          </Providers>
        </LiveProvider>
      </ClientProvider>
    </NavigationContainer>
  );
};

export default decorator;
