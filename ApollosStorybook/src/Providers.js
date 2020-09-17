import React from 'react';
import ApollosConfig from '@apollosproject/config';
import { Providers } from '@apollosproject/ui-kit';
import { MediaPlayerProvider } from '@apollosproject/ui-media-player';
import { LiveProvider } from '@apollosproject/ui-connected';
import ClientProvider, { client } from './client';
import customTheme, { customIcons } from './theme';

const AppProviders = (props) => (
  <ClientProvider>
    <MediaPlayerProvider>
        <LiveProvider>
          <Providers
            themeInput={customTheme}
            iconInput={customIcons}
            {...props}
          />
        </LiveProvider>
    </MediaPlayerProvider>
  </ClientProvider>
);

export default AppProviders;
