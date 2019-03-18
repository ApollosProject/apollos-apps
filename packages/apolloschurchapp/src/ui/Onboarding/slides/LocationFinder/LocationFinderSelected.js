import React, { memo } from 'react';
import { Query } from 'react-apollo';
import getCurrentCampus from './getCurrentCampus';
import LocationFinder from '.';

const requestLocation = async () => {
  await this.props.navigation.navigate('LocationFinderMapView');
};

const LocationFinderSelected = memo((props) => (
  <Query query={getCurrentCampus}>
    {({ data: { campus = null } = {} }) => (
      <LocationFinder
        onPressButton={requestLocation}
        buttonDisabled={!!campus}
        buttonText={'Yes, find my local campus'}
        campus={campus}
        {...props}
      />
    )}
  </Query>
));

export default LocationFinderSelected;
