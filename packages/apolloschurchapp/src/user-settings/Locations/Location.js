import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import MapView, { Marker } from 'react-native-maps';

import { styled, PaddedView, ButtonLink } from '@apollosproject/ui-kit';
import campuses from './getCampusLocations';
import markerDot from './markerDot.png';

const { width, height } = Dimensions.get('window');
const aspectRatio = width / height;

const LATITUDE = 34.001150;
const LONGITUDE = -81.032393;
const LATITUDE_DELTA = 7.85;
const LONGITUDE_DELTA = LATITUDE_DELTA * aspectRatio;

const StyledMapView = styled({
  ...StyleSheet.absoluteFillObject,
})(MapView);

class Location extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: 'Location',
    headerLeft: null,
    headerRight: (
      <PaddedView vertical={false}>
        <ButtonLink onPress={() => navigation.goBack()}>Back</ButtonLink>
      </PaddedView>
    ),
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
      goBack: PropTypes.func,
    }),
    initialRegion: PropTypes.shape({
      aspectRatio: PropTypes.number,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      latitudeDelta: PropTypes.number,
      longitutdeDelta: PropTypes.number,
    }),
    campuses: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number,
    }),
  };

  render() {
    return (
      <StyledMapView
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        showsUserLocation
      >
        {campuses.map((campus) => (
          <Marker
            coordinate={{
              latitude: campus.latitude,
              longitude: campus.longitude,
            }}
            title={campus.Name}
            key={campus.id}
            image={markerDot}
          />
        ))}
      </StyledMapView>
    );
  }
}

export default Location;
