import React from 'react';
import {
  Providers,
  renderWithApolloData,
  WithReactNavigator,
} from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import Onboarding from '.';

describe('the Onboarding component', () => {
  it('should render Onboarding', async () => {
    const tree = await renderWithApolloData(
      WithReactNavigator(
        <Providers MockedProvider={MockedProvider}>
          <Onboarding />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
});
