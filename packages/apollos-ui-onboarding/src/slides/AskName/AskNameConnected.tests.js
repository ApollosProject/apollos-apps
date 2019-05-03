import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';
import { renderWithApolloData } from 'apolloschurchapp/src/utils/testUtils';

import getUserProfile from '../../../../tabs/connect/getUserProfile';
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
        query: getUserProfile,
      },
      result: {
        data: {
          currentUser: {
            __typename: 'AuthenticatedUser',
            id: 'AuthenticatedUser:123',
            profile: {
              __typename: 'Person',
              id: 'Person:123',
              gender: 'Male',
              birthDate: '1980-02-10T00:00:00',
              firstName: 'Isaac',
              lastName: 'Hardy',
              campus: {
                __typename: 'Campus',
                id: 'Campus:a0f64573eabf00a607bec911794d50fb',
                name: 'Chicago Campus',
                latitude: 42.09203,
                longitude: -88.13289,
                distanceFromLocation: null,
                street1: '67 Algonquin Rd',
                street2: '',
                city: 'South Barrington',
                state: 'IL',
                postalCode: '60010-6143',
                image: {
                  __typename: 'ImageMediaSource',
                  uri: 'https://picsum.photos/300/300/?random',
                },
              },
              email: 'isaac.hardy@newspring.cc',
              nickName: 'Batman',
              photo: {
                __typename: 'ImageMediaSource',
                uri: 'https://some-uri.com/test.jpg',
              },
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
  it('renders loading state when fetching data', () => {
    const tree = renderer.create(
      <Providers mocks={[]}>
        <AskNameConnected onPressPrimary={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
