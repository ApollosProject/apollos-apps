import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { Dimensions } from 'react-native';

import { PaddedView, ButtonLink } from '@apollosproject/ui-kit';

import GET_USER_PROFILE from '../../tabs/connect/getUserProfile';
import MapView from './MapView';

import GET_CAMPUSES from './getCampusLocations';

import CHANGE_CAMPUS from './campusChange';

const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (e) => reject(e)
    );
  });

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;

class Location extends PureComponent {
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
    onFinished: PropTypes.func,
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

  static navigationOptions = ({ navigation }) => ({
    title: 'Location',
    headerLeft: null,
    headerRight: (
      <PaddedView vertical={false}>
        <ButtonLink onPress={() => navigation.goBack()}>Back</ButtonLink>
      </PaddedView>
    ),
  });

  state = {
    userLocation: {
      latitude: 39.104797,
      longitude: -84.511959,
    },
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
    const { navigation, onFinished } = this.props;
    // we should use the `onFinished` from the navigation param, if it exists.
    const handleFinished = this.props.navigation.getParam(
      'onFinished',
      onFinished
    );

    return (
      <Query
        query={GET_CAMPUSES}
        variables={{
          latitude: this.state.userLocation.latitude,
          longitude: this.state.userLocation.longitude,
        }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data: { campuses = [] } = {} }) => (
          <Mutation
            mutation={CHANGE_CAMPUS}
            update={async (cache, { data: { updateUserCampus } }) => {
              const { currentUser } = await cache.readQuery({
                query: GET_USER_PROFILE,
              });
              await cache.writeQuery({
                query: GET_USER_PROFILE,
                data: {
                  currentUser: {
                    ...currentUser,
                    profile: {
                      ...currentUser.profile,
                      campus: {
                        ...updateUserCampus.campus,
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
                  await navigation.goBack();
                  if (handleFinished) handleFinished();
                }}
              />
            )}
          </Mutation>
        )}
      </Query>
    );
  }
}

export default Location;
