/* eslint-disable import/prefer-default-export */
import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
import { MockedProvider } from 'react-apollo/test-utils';

const renderWithApolloData = async (component, existingTree) => {
  const tree = existingTree || renderer.create(component);
  await wait(1);
  tree.update(component);
  return tree;
};

// eslint-disable-next-line
const Providers = ({ children, ...props }) => (
  <UIProviders {...props}>
    <MockedProvider {...props}>{children}</MockedProvider>
  </UIProviders>
);

export { renderWithApolloData, Providers };
