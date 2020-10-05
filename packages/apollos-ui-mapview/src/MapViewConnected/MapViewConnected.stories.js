/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { ApolloStorybookDecorator } from '@apollosproject/ui-connected/src/testUtils';

import MapViewConnected from '.';

const mocks = {
  Query: () => ({
    campuses: () => [
      {
        __typename: 'Campus',
        city: 'Richardson',
        distanceFromLocation: 100.6461577685534,
        id: 'Campus:965b6e6d7046a885bea4e300b5c0400d',
        image: { uri: 'https://www.placecage.com/c/220/220' },
        latitude: 32.95103,
        longitude: -96.74738,
        name: 'Dallas Campus',
        postalCode: '75080-5525',
        state: 'TX',
        street1: '102 N Weatherred Dr',
      },
      {
        __typename: 'Campus',
        city: "When there's one",
        distanceFromLocation: null,
        id: 'Campus:965b6e6d7046a885bea4e300b5c04bla',
        image: { uri: 'https://www.placecage.com/c/220/220' },
        latitude: null,
        longitude: null,
        name: 'Online Campus',
        postalCode: '',
        state: "we'll let you know!",
        street1: 'No locations near you',
      },
      {
        __typename: 'Campus',
        city: 'Cincinnati',
        distanceFromLocation: 2037.6461577685534,
        id: 'Campus:4f68015ba18662a7409d1219a4ce013e',
        image: { uri: 'https://www.placecage.com/c/220/220' },
        latitude: 39.10501,
        longitude: -84.51138,
        name: 'Cincinnati Campus',
        postalCode: '45202-2118',
        state: 'OH',
        street1: '120 E 8th St',
      },
    ],
    currentUser: () => ({
      __typename: 'AuthenticatedUser',
      id: 'AuthenticatedUser:123',
      profile: {
        __typename: 'Person',
        id: 'Person:123',
        campus: {
          __typename: 'Campus',
          city: 'Richardson',
          distanceFromLocation: 100.6461577685534,
          id: 'Campus:965b6e6d7046a885bea4e300b5c0400d',
          image: 'https://www.placecage.com/c/220/220',
          latitude: 32.95103,
          longitude: -96.74738,
          name: 'Dallas Campus',
          postalCode: '75080-5525',
          state: 'TX',
          street1: '102 N Weatherred Dr',
        },
      },
    }),
  }),
};

const navigation = {
  getParam: () => {},
  navigate: () => {},
  goBack: () => {},
};

storiesOf('ui-mapview/MapViewConnected', module)
  .addDecorator(ApolloStorybookDecorator({ mocks }))
  .add('default', () => (
    <MapViewConnected navigation={navigation} onChangeCampus={async () => {}} />
  ));
