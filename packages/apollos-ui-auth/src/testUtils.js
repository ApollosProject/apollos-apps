/* eslint-disable import/prefer-default-export */
import React from 'react';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
import { MockedProvider } from 'react-apollo/test-utils';

// eslint-disable-next-line
export const Providers = ({ children, ...props }) => (
  <UIProviders {...props}>
    <MockedProvider {...props}>{children}</MockedProvider>
  </UIProviders>
);
