import React from 'react';
import { Providers, BackgroundView } from '@apollosproject/ui-kit';
import { LiveProvider } from '@apollosproject/ui-connected';
import ClientProvider, { client } from './client';
import customTheme, { customIcons } from './theme';

const AppProviders = (props) => (
  <ClientProvider>
    <LiveProvider>
      <Providers
        themeInput={customTheme}
        iconInput={customIcons}
        
      >
        <BackgroundView {...props} />
      </Providers>
    </LiveProvider>
  </ClientProvider>
);

export default AppProviders;
