import React from 'react';
import PropTypes from 'prop-types';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
import { MockedProvider } from '@apollo/client/testing';

export const Providers = ({ children, ...props }) => (
  <UIProviders {...props}>
    <MockedProvider {...props}>{children}</MockedProvider>
  </UIProviders>
);

Providers.propTypes = {
  children: PropTypes.node,
};
