import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

import { renderWithApolloData, Providers } from '../../testUtils';

import GET_USER_FIRST_NAME from './getUserFirstName';
import FeaturesConnected from './FeaturesConnected';

describe('The Onboarding FeaturesConnected component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <FeaturesConnected />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a firstName when logged in', async () => {
    const mock = {
      request: {
        query: GET_USER_FIRST_NAME,
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

    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <FeaturesConnected />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom Component', async () => {
    const mock = {
      request: {
        query: GET_USER_FIRST_NAME,
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
