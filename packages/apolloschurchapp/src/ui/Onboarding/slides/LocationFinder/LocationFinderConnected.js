import React, { memo } from 'react';
import { Query, ApolloConsumer } from 'react-apollo';
import NavigationActions from 'apolloschurchapp/src/NavigationService';
import getUserCampus from './getUserCampus';
import { getCurrentCampus, requestCurrentCampus } from './campusUtils';
import LocationFinder from '.';

// const requestLocation = async () => {
//   await NavigationActions.navigate('LocationFinderMapView');
// };

// eslint-disable-next-line react/display-name
const LocationFinderConnected = memo((props) => (
  <Query query={getUserCampus} fetchPolicy="cache-and-network">
    {({
      data: {
        currentUser: {
          profile: { campus } = {
            campus: {},
          },
        } = {},
      } = {},
    }) => (
      <ApolloConsumer>
        {(client) => (
          <Query query={getCurrentCampus}>
            {({ data: { isCurrentCampus = false } = {} }) => (
              <LocationFinder
                onPressButton={async () => {
                  await requestCurrentCampus({ client });
                  await NavigationActions.navigate('LocationFinderMapView');
                }}
                buttonText={
                  isCurrentCampus
                    ? 'Confirm your Campus '
                    : 'Yes, find my local campus'
                }
                campus={campus}
                {...props}
              />
            )}
          </Query>
        )}
      </ApolloConsumer>
    )}
  </Query>
));

export default LocationFinderConnected;
