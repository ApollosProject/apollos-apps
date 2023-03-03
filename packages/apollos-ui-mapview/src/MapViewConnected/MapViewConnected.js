import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/client';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { get } from 'lodash';

import MapView from '../MapView';
import getUserLocation from '../utils/getUserLocation';
import GET_CAMPUSES from './getCampusLocations';
import CHANGE_CAMPUS from './campusChange';

const Location = ({
  Component,
  changeCampusOptions,
  onChangeCampus,
  initialRegion,
}) => {
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);
  const [loadingNewCampus, setLoadingNewCampus] = useState(false);

  useEffect(() => {
    const setLocation = async () => {
      const position = await getUserLocation();
      if (position) {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }
    };
    setLocation();
  }, []);

  const { data: { campuses, currentUser } = {}, loading, error } = useQuery(
    GET_CAMPUSES,
    {
      variables: {
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
      },
      fetchPolicy: 'cache-and-network',
    }
  );

  const [changeCampus] = useMutation(CHANGE_CAMPUS);

  return (
    <Component
      navigation={navigation}
      isLoading={loading}
      error={error}
      campuses={campuses || []}
      initialRegion={initialRegion}
      userLocation={userLocation}
      currentCampus={get(currentUser, 'profile.campus')}
      isLoadingSelectedCampus={loadingNewCampus}
      onLocationSelect={async (campus) => {
        setLoadingNewCampus(true);
        await changeCampus({
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
        onChangeCampus && onChangeCampus({ campus });
        navigation.goBack();
      }}
    />
  );
};

Location.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
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

Location.defaultProps = {
  Component: MapView,
  initialRegion: {
    // roughly show the entire USA by default
    latitude: 39.809734,
    longitude: -98.555618,
    latitudeDelta: 100,
    longitudeDelta:
      (100 * Dimensions.get('window').width) / Dimensions.get('window').height,
  },
};

export default Location;
