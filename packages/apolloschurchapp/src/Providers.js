import React from 'react';
import { Providers } from '@apollosproject/ui-kit';
import { AuthProvider } from '@apollosproject/ui-auth';
import NavigationService from './NavigationService';
import { NotificationsManager } from './notifications';
import ClientProvider from './client';

const AppProviders = (props) => (
  <ClientProvider {...props}>
    <NotificationsManager>
      <AuthProvider navigateToAuth={() => NavigationService.navigate('Auth')}>
        <Providers {...props} />
      </AuthProvider>
    </NotificationsManager>
  </ClientProvider>
);

export default AppProviders;
