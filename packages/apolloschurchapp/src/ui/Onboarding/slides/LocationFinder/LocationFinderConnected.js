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
  <ApolloConsumer>
    {(client) => (
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
          <Query query={getCurrentCampus}>
            {({ data: { isCurrentCampus = false } = {} }) => (
              <LocationFinder
                onPressButton={async () => {
                  await requestCurrentCampus({ client });
                  await NavigationActions.navigate('LocationFinderMapView');
                }}
                buttonDisabled={isCurrentCampus}
                buttonText={
                  isCurrentCampus
                    ? 'We found your campus! '
                    : 'Yes, find my local campus'
                }
                campus={isCurrentCampus ? campus : null}
                {...props}
              />
            )}
          </Query>
        )}
      </Query>
    )}
  </ApolloConsumer>
));

export default LocationFinderConnected;
