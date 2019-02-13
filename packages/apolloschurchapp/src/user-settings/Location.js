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

const initialRegion = {
  aspectRatio: width / height,
  latitute: 34.595334,
  longitude: -82.621761,
  latitudeDelta: 0.55,
};

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
          latitude: initialRegion.latitude,
          longitude: initialRegion.longitude,
          latitudeDelta: initialRegion.latitudeDelta,
          longitudeDelta:
            initialRegion.latitudeDelta * initialRegion.aspectRatio,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
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
