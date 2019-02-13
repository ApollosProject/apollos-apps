import React, { PureComponent } from 'react';
import { Dimensions, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import MapView, { Marker } from 'react-native-maps';

import {
  // TextInput,
  PaddedView,
  // FlexedView,
  // Button,
  ButtonLink,
  // TableView,
} from '@apollosproject/ui-kit';
import marker from './marker.png';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 34.595334;
const LONGITUDE = -82.621761;
const LATITUDE_DELTA = 0.55;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    marginLeft: 46,
    marginTop: 33,
    fontWeight: 'bold',
  },
});

class Location extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: 'Location',
    headerLeft: null,
    headerRight: (
      <PaddedView vertical={false}>
        <ButtonLink onPress={() => navigation.goBack()}>Cancel</ButtonLink>
      </PaddedView>
    ),
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
      goBack: PropTypes.func,
    }),
  };

  render() {
    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
          }}
          anchor={{ x: 0.69, y: 1 }}
          image={marker}
        >
          <Text style={styles.marker}>NewSpring Anderson</Text>
        </Marker>
        <Marker
          coordinate={{
            latitude: 34.82474,
            longitude: -82.368624,
          }}
          anchor={{ x: 0.69, y: 1 }}
          image={marker}
        >
          <Text style={styles.marker}>NewSpring Greenville</Text>
        </Marker>
      </MapView>
    );
  }
}

export default Location;
