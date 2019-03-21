import React, { memo } from 'react';
import { Query } from 'react-apollo';
import NavigationActions from 'apolloschurchapp/src/NavigationService';
import getCurrentCampus from './getCurrentCampus';
import LocationFinder from '.';

const requestLocation = async () => {
  await NavigationActions.navigate('LocationFinderMapView');
};

const LocationFinderSelected = memo((props) => (
  <Query query={getCurrentCampus} fetchPolicy="cache-and-network">
    {({
      data: {
        currentUser: {
          profile: { campus } = {
            campus: {},
          },
        } = {},
      } = {},
      refetch,
    }) => (
      <LocationFinder
        onPressButton={requestLocation}
        buttonText={
          campus ? 'We found your campus!' : 'Yes, find my local campus'
        }
        buttonDisabled={!!campus}
        campus={campus}
        refetch={refetch}
        {...props}
      />
    )}
  </Query>
));

export default LocationFinderSelected;
