import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { Dimensions } from 'react-native';

import MapView from 'apolloschurchapp/src/user-settings/Locations';

import campusChange from 'apolloschurchapp/src/user-settings/Locations/campusChange';
import getCampusLocations from 'apolloschurchapp/src/user-settings/Locations/getCampusLocations';
import getUserCampus from './getUserCampus';

const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (e) => reject(e)
    );
  });

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;

class LocationFinderMapView extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
      goBack: PropTypes.func,
    }),
    initialRegion: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      latitudeDelta: PropTypes.number,
      longitudeDelta: PropTypes.number,
    }),
  };

  static defaultProps = {
    initialRegion: {
      // roughly show the entire USA by default
      latitude: 39.809734,
      longitude: -98.555618,
      latitudeDelta: 100,
      longitudeDelta: 100 * ASPECT_RATIO,
    },
  };

  static navigationOptions = () => ({
    title: 'LocationFinderMapView',
    header: null,
  });

  state = {
    region: this.props.initialRegion,
  };

  componentDidMount() {
    return getCurrentLocation().then((position) => {
      if (position) {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      }
    });
  }

  render() {
    const { navigation } = this.props;
    return (
      <Query
        query={getCampusLocations}
        variables={{
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
        }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data: { campuses = [] } = {} }) => (
          <Mutation
            mutation={campusChange}
            update={async (cache, { data: { updateUserCampus } }) => {
              const { currentUser } = await cache.readQuery({
                query: getUserCampus,
              });
              await cache.writeQuery({
                query: getUserCampus,
                data: {
                  currentUser: {
                    ...currentUser,
                    profile: {
                      ...currentUser.profile,
                      campus: {
                        ...currentUser.profile.campus,
                        id: updateUserCampus.campus.id,
                        name: updateUserCampus.campus.name,
                        latitude: updateUserCampus.campus.latitude,
                        longitude: updateUserCampus.campus.longitude,
                        distanceFromLocation:
                          updateUserCampus.campus.distanceFromLocation,
                        street1: updateUserCampus.campus.street1,
                        street2: updateUserCampus.campus.street2,
                        city: updateUserCampus.campus.city,
                        state: updateUserCampus.campus.state,
                        postalCode: updateUserCampus.campus.postalCode,
                        image: updateUserCampus.campus.image,
                      },
                    },
                  },
                },
              });
            }}
          >
            {(handlePress) => (
              <MapView
                navigation={navigation}
                isLoading={loading}
                error={error}
                campuses={campuses}
                initialRegion={this.props.initialRegion}
                userLocation={this.state.userLocation}
                onLocationSelect={async ({ id }) => {
                  await handlePress({
                    variables: {
                      campusId: id,
                    },
                  });
                  await navigation.navigate('Onboarding');
                }}
              />
            )}
          </Mutation>
        )}
      </Query>
    );
  }
}

export default LocationFinderMapView;
