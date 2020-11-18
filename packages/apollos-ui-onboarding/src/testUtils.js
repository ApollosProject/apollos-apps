/* eslint-disable import/prefer-default-export */
import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
import { MockedProvider } from '@apollo/client/testing';

export async function renderWithApolloData(component) {
  const tree = renderer.create(component);
  await renderer.act(async () => {
    await wait(0);
    tree.update(component);
  });
  return tree;
}

// eslint-disable-next-line
export const Providers = ({ mocks, children, ...props }) => (
  <UIProviders {...props}>
    <MockedProvider {...props} mocks={mocks}>
      {children}
    </MockedProvider>
  </UIProviders>
);
