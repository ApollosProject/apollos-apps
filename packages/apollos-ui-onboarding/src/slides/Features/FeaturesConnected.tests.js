import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import wait from 'waait';

import { renderWithApolloData, Providers } from '../../testUtils';

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
  it('should render a custom Component', async () => {
    const mock = {
      request: {
        query: getUserFirstName,
      },
      result: {
        data: {
          currentUser: {
            __typename: 'AuthenticatedUser',
            id: 'AuthenticatedUser:123',
            profile: {
              __typename: 'Person',
              id: 'Person:123',
              firstName: 'Marty',
            },
          },
        },
      },
    };

    // eslint-disable-next-line react/prop-types
    const CustomComponent = ({ firstName }) => (
      <Text>{`${firstName} also thinks Skyline chili is the best.`}</Text>
    );

    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <FeaturesConnected Component={CustomComponent} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
