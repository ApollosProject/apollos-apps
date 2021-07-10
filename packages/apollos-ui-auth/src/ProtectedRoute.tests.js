import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import wait from 'waait';

import { Providers } from '@apollosproject/ui-kit';
import { WithReactNavigator } from '@apollosproject/ui-test-utils';
import { InMemoryCache } from '@apollo/client/cache';
import { MockedProvider } from '@apollo/client/testing';
import AuthProvider from './Provider';
import ProtectedRoute from './ProtectedRoute';

describe('ProtectedRoute component', () => {
  it('renders a custom loading component', async () => {
    const cache = new InMemoryCache();
    const tree = renderer.create(
      WithReactNavigator(
        <MockedProvider cache={cache}>
          <AuthProvider>
            <Providers>
              <ProtectedRoute LoadingIndicator={<View />} />
            </Providers>
          </AuthProvider>
        </MockedProvider>
      )
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
