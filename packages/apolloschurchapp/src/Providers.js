import React from 'react';
import { Providers } from '@apollosproject/ui-kit';
import { AuthProvider } from '@apollosproject/ui-auth';
import NavigationService from './NavigationService';
import ClientProvider from './client';

const AppProviders = (props) => (
  <ClientProvider>
    <AuthProvider navigateToAuth={() => NavigationService.navigate('Auth')}>
      <Providers {...props} />
    </AuthProvider>
  </ClientProvider>
);

export default AppProviders;
