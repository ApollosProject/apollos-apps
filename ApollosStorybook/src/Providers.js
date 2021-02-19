import React from 'react';
import ApollosConfig from '@apollosproject/config';
import { Providers } from '@apollosproject/ui-kit';
import { LiveProvider } from '@apollosproject/ui-connected';
import { NavigationContainer } from '@react-navigation/native';
import ClientProvider, { client } from './client';
import customTheme, { customIcons } from './theme';

const AppProviders = (props) => (
  <NavigationContainer>
    <ClientProvider>
      <LiveProvider>
        <Providers
          themeInput={customTheme}
          iconInput={customIcons}
          {...props}
        />
      </LiveProvider>
    </ClientProvider>
  </NavigationContainer>
);

export default AppProviders;
