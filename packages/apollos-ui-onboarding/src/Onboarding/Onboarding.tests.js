import React from 'react';
import renderer from 'react-test-renderer';
import { Providers, WithReactNavigator } from '@apollosproject/ui-test-utils';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

import Onboarding from '.';

const mocks = [
  {
    request: {
      query: gql`
        {
          currentUser {
            id
          }
        }
      `,
    },
    result: { data: { currentUser: 'User:123' } },
  },
];

describe('the Onboarding component', () => {
  it('should render Onboarding', async () => {
    const tree = renderer.create(
      WithReactNavigator(
        <Providers MockedProvider={MockedProvider} mocks={mocks}>
          <Onboarding />
        </Providers>
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(tree).toMatchSnapshot();
  });
});
