import React from 'react';
import ApollosConfig from '@apollosproject/config';
import { Providers } from '@apollosproject/ui-kit';
import { LiveProvider } from '@apollosproject/ui-connected';
import ClientProvider, { client } from './client';
import customTheme, { customIcons } from './theme';

const AppProviders = (props) => (
  <ClientProvider>
      <LiveProvider>
        <Providers
          themeInput={customTheme}
          iconInput={customIcons}
          {...props}
        />
      </LiveProvider>
  </ClientProvider>
);

export default AppProviders;
