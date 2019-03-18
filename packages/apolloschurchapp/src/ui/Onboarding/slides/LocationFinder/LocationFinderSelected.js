import React, { memo } from 'react';
import { Query } from 'react-apollo';
import getCurrentCampus from './getCurrentCampus';
import LocationFinder from '.';

const requestLocation = async () => {
  await this.props.navigation.navigate('LocationFinderMapView');
};

const LocationFinderSelected = memo((props) => (
  <Query query={getCurrentCampus}>
    {({ data: { currentCampus = false } = {} }) => (
      <LocationFinder
        onPressButton={requestLocation}
        buttonDisabled={currentCampus}
        buttonText={'Yes, find my local campus'}
        {...props}
      />
    )}
  </Query>
));

export default LocationFinderSelected;
