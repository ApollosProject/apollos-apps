import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from '@apollo/client/react/components';
import { Dimensions } from 'react-native';
import { PaddedView, ButtonLink } from '@apollosproject/ui-kit';
import { get } from 'lodash';

import MapView from '../MapView';
import getUserLocation from '../utils/getUserLocation';
import GET_CAMPUSES from './getCampusLocations';
import CHANGE_CAMPUS from './campusChange';

class Location extends PureComponent {
  static propTypes = {
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      goBack: PropTypes.func,
    }),
    initialRegion: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      latitudeDelta: PropTypes.number,
      longitudeDelta: PropTypes.number,
    }),
    changeCampusOptions: PropTypes.shape({
      refetchQueries: PropTypes.arrayOf(PropTypes.shape()),
    }),
    onChangeCampus: PropTypes.func,
  };

  static defaultProps = {
    Component: MapView,
    initialRegion: {
      // roughly show the entire USA by default
      latitude: 39.809734,
      longitude: -98.555618,
      latitudeDelta: 100,
      longitudeDelta:
        (100 * Dimensions.get('window').width) /
        Dimensions.get('window').height,
    },
  };

  state = {
    userLocation: null,
    loadingNewCampus: false,
  };

  async componentDidMount() {
    try {
      const position = await getUserLocation();
      if (position) {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      }
    } catch (e) {
      console.warn(e);
    }
  }

  render() {
    const { Component, changeCampusOptions } = this.props; // is just to appease the linter 😢
    return (
      <Query
        query={GET_CAMPUSES}
        variables={{
          latitude: get(this.state, 'userLocation.latitude'),
          longitude: get(this.state, 'userLocation.longitude'),
        }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data: { campuses, currentUser } = {} }) => (
          <Mutation mutation={CHANGE_CAMPUS}>
            {(handlePress) => (
              <Component
                navigation={this.props.navigation}
                isLoading={loading}
                error={error}
                campuses={campuses || []}
                initialRegion={this.props.initialRegion}
                userLocation={this.state.userLocation}
                currentCampus={get(currentUser, 'profile.campus')}
                isLoadingSelectedCampus={this.state.loadingNewCampus}
                onLocationSelect={async (campus) => {
                  this.setState({ loadingNewCampus: true });
                  await handlePress({
                    variables: {
                      campusId: campus.id,
                    },
                    optimisticResponse: {
                      updateUserCampus: {
                        __typename: 'Mutation',
                        id: currentUser.id,
                        campus,
                      },
                    },
                    ...changeCampusOptions,
                  });
                  // eslint-disable-next-line no-unused-expressions
                  this.props.onChangeCampus &&
                    this.props.onChangeCampus({ campus });
                  this.props.navigation.goBack();
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
