import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

import { Providers, renderWithApolloData } from '../../testUtils';

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
          data: { campus: null },
        },
      },
    ];

    const component = (
      <Providers mocks={mocks} addTypename={false}>
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
            campus: {
              campus: {
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
                  uri:
                    'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Dede1fb83-968e-4bef-8d77-ad81c96e8a47',
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
      <Providers mocks={mocks} addTypename={false}>
        <LocationFinderConnected
          Component={CustomComponent}
          onNavigate={jest.fn()}
        />
      </Providers>
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
            campus: {
              campus: {
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
                  uri:
                    'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Dede1fb83-968e-4bef-8d77-ad81c96e8a47',
                },
              },
            },
          },
        },
      },
    ];

    const component = (
      <Providers mocks={mocks} addTypename={false}>
        <LocationFinderConnected onNavigate={jest.fn()} />
      </Providers>
    );

    const tree = await renderWithApolloData(component);
    expect(tree).toMatchSnapshot();
  });

  it('should render with no data in the cache', () => {
    const tree = renderer.create(
      <Providers>
        <LocationFinderConnected onNavigate={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
