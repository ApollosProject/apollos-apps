import React from 'react';
import { Providers } from '@apollosproject/ui-kit';
import { AuthProvider } from '@apollosproject/ui-auth';
import { AnalyticsProvider } from '@apollosproject/ui-analytics';
import { MediaPlayerProvider } from '@apollosproject/ui-media-player';

import NavigationService from './NavigationService';
import { NotificationsManager } from './notifications';
import ClientProvider from './client';
import customTheme, { customIcons } from './theme';

const AppProviders = (props) => (
  <ClientProvider {...props}>
    <NotificationsManager>
      <AuthProvider
        navigateToAuth={() => NavigationService.navigate('Auth')}
        closeAuth={() => NavigationService.navigate('Onboarding')}
      >
        <MediaPlayerProvider>
          <AnalyticsProvider>
            <Providers
              themeInput={customTheme}
              iconInput={customIcons}
              {...props}
            />
          </AnalyticsProvider>
        </MediaPlayerProvider>
      </AuthProvider>
    </NotificationsManager>
  </ClientProvider>
);

export default AppProviders;
