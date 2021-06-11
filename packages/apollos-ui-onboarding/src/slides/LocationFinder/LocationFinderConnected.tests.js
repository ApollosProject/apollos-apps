import React from 'react';
import { Text } from 'react-native';

import {
  Providers,
  renderWithApolloData,
  WithReactNavigator,
} from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import LocationFinderConnected from './LocationFinderConnected';
import GET_USER_CAMPUS from './getUserCampus';

const navigation = { navigate: jest.fn() };
describe('The Onboarding LocationFinderConnected component', () => {
  it('should render with a user not having a campus selected', async () => {
    const mocks = [
      {
        request: {
          query: GET_USER_CAMPUS,
        },
        result: {
          data: {
            currentUser: {
              __typename: 'AuthenticatedUser',
              id: 'AuthenticatedUser:123',
              profile: { id: 'Person:123', __typename: 'Person', campus: null },
            },
          },
        },
      },
    ];

    const component = WithReactNavigator(
      <Providers MockedProvider={MockedProvider} mocks={mocks}>
        <LocationFinderConnected
          navigation={navigation}
          onNavigate={jest.fn()}
        />
      </Providers>
    );

    const tree = await renderWithApolloData(component);
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom component', async () => {
    const mocks = [
      {
        request: {
          query: GET_USER_CAMPUS,
        },
        result: {
          data: {
            currentUser: {
              __typename: 'AuthenticatedUser',
              id: 'AuthenticatedUser:123',
              profile: {
                __typename: 'Person',
                id: 'Person:123',
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
                    uri:
                      'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Dede1fb83-968e-4bef-8d77-ad81c96e8a47',
                  },
                },
              },
            },
          },
        },
      },
    ];

    // eslint-disable-next-line react/prop-types
    const CustomComponent = ({ buttonText }) => (
      <Text>{`${buttonText} nearest a Skyline chili.`}</Text>
    );

    const tree = await renderWithApolloData(
      WithReactNavigator(
        <Providers mocks={mocks} MockedProvider={MockedProvider}>
          <LocationFinderConnected
            Component={CustomComponent}
            onNavigate={jest.fn()}
          />
        </Providers>
      )
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a user having selected a campus', async () => {
    const mocks = [
      {
        request: {
          query: GET_USER_CAMPUS,
        },
        result: {
          data: {
            currentUser: {
              id: 'AuthenticatedUser:123',
              __typename: 'AuthenticatedUser',
              profile: {
                __typename: 'Person',
                id: 'Person:123',
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
                    uri:
                      'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Dede1fb83-968e-4bef-8d77-ad81c96e8a47',
                  },
                },
              },
            },
          },
        },
      },
    ];

    const component = WithReactNavigator(
      <Providers mocks={mocks} MockedProvider={MockedProvider}>
        <LocationFinderConnected onNavigate={jest.fn()} />
      </Providers>
    );

    const tree = await renderWithApolloData(component);
    expect(tree).toMatchSnapshot();
  });
});
