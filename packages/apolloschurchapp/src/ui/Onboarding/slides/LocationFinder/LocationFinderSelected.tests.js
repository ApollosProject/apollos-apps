import React from 'react';
import renderer from 'react-test-renderer';
import Providers from 'apolloschurchapp/src/Providers';
import { renderWithApolloData } from 'apolloschurchapp/src/utils/testUtils';

import LocationFinderSelected from './LocationFinderSelected';
import getCurrentCampus from './getCurrentCampus';

describe('The Onboarding LocationFinderSelected component', () => {
  it('should render with a user not having a campus selected', async () => {
    const mocks = [
      {
        request: {
          query: getCurrentCampus,
        },
        result: {
          data: { campus: null },
        },
      },
    ];

    const component = (
      <Providers mocks={mocks} addTypename={false}>
        <LocationFinderSelected />
      </Providers>
    );

    const tree = await renderWithApolloData(component);
    expect(tree).toMatchSnapshot();
  });
  it('should render with a user having selected a campus', async () => {
    const mocks = [
      {
        request: {
          query: getCurrentCampus,
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
        <LocationFinderSelected />
      </Providers>
    );

    const tree = await renderWithApolloData(component);
    expect(tree).toMatchSnapshot();
  });

  it('should render with no data in the cache', () => {
    const tree = renderer.create(
      <Providers>
        <LocationFinderSelected />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
