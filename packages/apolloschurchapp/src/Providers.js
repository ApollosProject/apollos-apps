import React from 'react';
import { Providers } from '@apollosproject/ui-kit';
import { AuthProvider } from '@apollosproject/ui-auth';
import { AnalyticsProvider } from '@apollosproject/ui-analytics';

import NavigationService from './NavigationService';
import { NotificationsManager } from './notifications';
import ClientProvider from './client';
import * as CustomIcons from './icons';

const AppProviders = (props) => (
  <ClientProvider {...props}>
    <NotificationsManager>
      <AuthProvider
        navigateToAuth={() => NavigationService.navigate('Auth')}
        closeAuth={() => NavigationService.navigate('Onboarding')}
      >
        <AnalyticsProvider>
          <Providers iconInput={CustomIcons} {...props} />
        </AnalyticsProvider>
      </AuthProvider>
    </NotificationsManager>
  </ClientProvider>
);

export default AppProviders;
