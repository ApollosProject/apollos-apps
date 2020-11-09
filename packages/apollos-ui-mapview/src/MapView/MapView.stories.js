/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import MapView from '.';

const campuses = [
  {
    city: 'Richardson',
    distanceFromLocation: null,
    id: 'Campus:965b6e6d7046a885bea4e300b5c0400d',
    image: 'https://www.placecage.com/c/220/220',
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
    image: 'https://www.placecage.com/c/220/220',
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
  image: 'https://www.placecage.com/c/220/220',
  latitude: 32.95103,
  longitude: -96.74738,
  name: 'Dallas Campus',
  postalCode: '75080-5525',
  state: 'TX',
  street1: '102 N Weatherred Dr',
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

storiesOf('ui-mapview/MapView', module)
  .add('default', () => (
    <MapView
      navigation={navigation}
      campuses={campuses}
      initialRegion={initialRegion}
      userLocation={currentCampus}
      currentCampus={currentCampus}
      onLocationSelect={async () => {}}
    />
  ))
  .add('buttonTitle', () => (
    <MapView
      navigation={navigation}
      campuses={campuses}
      initialRegion={initialRegion}
      userLocation={currentCampus}
      currentCampus={currentCampus}
      onLocationSelect={async () => {}}
      buttonTitle={'Custom buttonTitle'}
    />
  ))
  .add('isLoading', () => (
    <MapView
      navigation={navigation}
      campuses={campuses}
      initialRegion={initialRegion}
      userLocation={currentCampus}
      currentCampus={currentCampus}
      onLocationSelect={async () => {}}
      isLoading
    />
  ));
