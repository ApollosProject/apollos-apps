/* eslint-disable import/prefer-default-export */
import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
import { MockedProvider as HookedMockedProvider } from '@apollo/react-testing';

export const renderWithApolloData = async (component) => {
  const tree = renderer.create(component);
  await wait(1);
  tree.update(component);
  return tree;
};

// eslint-disable-next-line
export const Providers = ({ children, ...props }) => (
  <UIProviders {...props}>
    <HookedMockedProvider {...props}>{children}</HookedMockedProvider>
  </UIProviders>
);
