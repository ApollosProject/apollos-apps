import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Providers from 'apolloschurchapp/src/Providers';

import getUserFirstName from './getUserFirstName';
import FeaturesConnected from './FeaturesConnected';

describe('The Onboarding FeaturesConnected component', () => {
  it('renders with a firstName when logged in', async () => {
    const mock = {
      request: {
        query: getUserFirstName,
      },
      result: {
        data: {
          currentUser: {
            profile: {
              firstName: 'Marty',
            },
          },
        },
      },
    };
    const tree = renderer.create(
      <Providers mocks={[mock]}>
        <FeaturesConnected />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
