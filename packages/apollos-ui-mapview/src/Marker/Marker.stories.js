import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';

import { FlexedMapView } from '../MapView';

import Marker from '.';

const initialRegion = {
  latitude: 39.809734,
  latitudeDelta: 100,
  longitude: -98.555618,
  longitudeDelta: 46.205357142857146,
};

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
    opacity: 1,
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
    opacity: 0.35,
  },
];

storiesOf('ui-mapview/Marker', module).add('default', () => (
  <FlexedMapView initialRegion={initialRegion} showsUserLocation>
    {campuses.map((campus) => {
      const campusOpacity = {
        opacity: campus.opacity,
      };
      return (
        <Marker
          onPress={() => {}}
          key={campus.id}
          opacityStyle={campusOpacity}
          latitude={campus.latitude}
          longitude={campus.longitude}
        />
      );
    })}
  </FlexedMapView>
));
