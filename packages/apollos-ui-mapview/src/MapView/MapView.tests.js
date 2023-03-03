import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-kit';

import MapView from '.';

const campuses = [
  {
    city: 'Richardson',
    distanceFromLocation: null,
    id: 'Campus:965b6e6d7046a885bea4e300b5c0400d',
    image: 'https://www.placecage.com/c/250/250',
    latitude: 32.95103,
    longitude: -96.74738,
    name: 'Dallas Campus',
    postalCode: '75080-5525',
    state: 'TX',
    street1: '102 N Weatherred Dr',
  },
  {
    city: 'Cincinnati',
    distanceFromLocation: 2037.6461577685534,
    id: 'Campus:4f68015ba18662a7409d1219a4ce013e',
    image: 'https://www.placecage.com/c/250/250',
    latitude: 39.10501,
    longitude: -84.51138,
    name: 'Cincinnati Campus',
    postalCode: '45202-2118',
    state: 'OH',
    street1: '120 E 8th St',
  },
];

const currentCampus = {
  city: 'Richardson',
  distanceFromLocation: null,
  id: 'Campus:965b6e6d7046a885bea4e300b5c0400d',
  image: 'https://www.placecage.com/c/250/250',
  latitude: 32.95103,
  longitude: -96.74738,
  name: 'Dallas Campus',
  postalCode: '75080-5525',
  state: 'TX',
  street1: '102 N Weatherred Dr',
};

const digitalCampus = {
  city: 'Digital Campus',
  distanceFromLocation: null,
  id: 'Campus:575b6e6d7046a885bea4e300b5c04067',
  image: 'https://www.placecage.com/c/250/250',
  latitude: null,
  longitude: null,
  name: 'Online',
  postalCode: '',
  state: '',
  street1: '',
};

const initialRegion = {
  latitude: 39.809734,
  latitudeDelta: 100,
  longitude: -98.555618,
  longitudeDelta: 46.205357142857146,
};

const navigation = {
  navigate: () => {},
  goBack: () => {},
};

describe('<MapView>', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <MapView
          navigation={navigation}
          campuses={campuses}
          initialRegion={initialRegion}
          userLocation={currentCampus}
          currentCampus={currentCampus}
          onLocationSelect={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a digital campus', () => {
    const tree = renderer.create(
      <Providers>
        <MapView
          navigation={navigation}
          campuses={[...campuses, digitalCampus]}
          initialRegion={initialRegion}
          userLocation={currentCampus}
          currentCampus={currentCampus}
          onLocationSelect={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom buttonTitle', () => {
    const tree = renderer.create(
      <Providers>
        <MapView
          navigation={navigation}
          campuses={campuses}
          initialRegion={initialRegion}
          userLocation={currentCampus}
          currentCampus={currentCampus}
          onLocationSelect={jest.fn()}
          buttonTitle={'Custtom buttonTitle'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
