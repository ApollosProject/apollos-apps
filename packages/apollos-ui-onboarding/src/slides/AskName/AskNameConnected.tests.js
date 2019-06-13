import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

import { Providers, renderWithApolloData } from '../../testUtils';

import getUserFirstAndLastName from './getUserFirstAndLastName';
import AskNameConnected from './AskNameConnected';

describe('The AskNameConnected component', () => {
  it('renders in a default state', () => {
    const tree = renderer.create(
      <Providers>
        <AskNameConnected onPressPrimary={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders User Name when logged in', async () => {
    const mock = {
      request: {
        query: getUserFirstAndLastName,
      },
      result: {
        data: {
          currentUser: {
            __typename: 'AuthenticatedUser',
            id: 'AuthenticatedUser:123',
            profile: {
              __typename: 'Person',
              id: 'Person:123',
              firstName: 'Isaac',
              lastName: 'Hardy',
            },
          },
        },
      },
    };
    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <AskNameConnected onPressPrimary={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom Component', async () => {
    const mock = {
      request: {
        query: getUserFirstAndLastName,
      },
      result: {
        data: {
          currentUser: {
            __typename: 'AuthenticatedUser',
            id: 'AuthenticatedUser:123',
            profile: {
              __typename: 'Person',
              id: 'Person:123',
              firstName: 'Isaac',
              lastName: 'Hardy',
            },
          },
        },
      },
    };

    // eslint-disable-next-line react/prop-types
    const CustomComponent = ({ firstName, lastName }) => (
      <Text>
        {`${firstName} ${lastName} thinks Skyline chili is the best.`}
      </Text>
    );

    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <AskNameConnected
          Component={CustomComponent}
          onPressPrimary={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders loading state when fetching data', () => {
    const tree = renderer.create(
      <Providers mocks={[]}>
        <AskNameConnected onPressPrimary={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
