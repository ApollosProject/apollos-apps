import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Animated,
  Image,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';

import { styled, PaddedView, ButtonLink } from '@apollosproject/ui-kit';

const { width, height } = Dimensions.get('window');

const CARD_HEIGHT = height / 5;
const CARD_WIDTH = CARD_HEIGHT + 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(107,172,67, 0.9)',
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(107,172,67, 0.3)',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(107,172,67, 0.5)',
  },
});

const StyledMapView = styled({
  ...StyleSheet.absoluteFillObject,
})(MapView);

class Location extends React.Component {
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
    markers: [
      {
        title: 'Aiken',
        coordinate: {
          latitude: 33.5664789,
          longitude: -81.7465594,
        },
        id: 0,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Anderson',
        coordinate: {
          latitude: 34.595434,
          longitude: -82.6244131,
        },
        id: 1,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Charleston',
        coordinate: {
          latitude: 32.914992,
          longitude: -80.1035458,
        },
        id: 2,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Clemson',
        coordinate: {
          latitude: 34.68901,
          longitude: -82.8589537,
        },
        id: 3,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Columbia',
        coordinate: {
          latitude: 34.030309,
          longitude: -81.098607,
        },
        id: 4,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Florence',
        coordinate: {
          latitude: 34.2121752,
          longitude: -79.7992434,
        },
        id: 5,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Greenville',
        coordinate: {
          latitude: 34.852042,
          longitude: -82.3567597,
        },
        id: 6,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Greenwood',
        coordinate: {
          latitude: 34.2140468,
          longitude: -82.1496785,
        },
        id: 7,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Hilton Head',
        coordinate: {
          latitude: 32.2722634,
          longitude: -80.9448838,
        },
        id: 8,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Myrtle Beach',
        coordinate: {
          latitude: 33.7159127,
          longitude: -78.9272232,
        },
        id: 9,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Northeast Columbia',
        coordinate: {
          latitude: 34.1109545,
          longitude: -80.883067,
        },
        id: 10,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Powdersville',
        coordinate: {
          latitude: 34.7877695,
          longitude: -82.4856855,
        },
        id: 11,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Rock Hill',
        coordinate: {
          latitude: 34.950421,
          longitude: -81.0898858,
        },
        id: 12,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
      {
        title: 'Spartanburg',
        coordinate: {
          latitude: 34.9331235,
          longitude: -81.9966683,
        },
        id: 13,
        image: { uri: 'https://i.imgur.com/sNam9iJ.jpg' },
      },
    ],
    region: {
      latitude: 34.00115,
      longitude: -81.032393,
      latitudeDelta: 0.7,
      longitudeDelta: 0.07,
    },
  };

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

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  componentDidMount() {
    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH,
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: 'clamp',
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: 'clamp',
      });
      return { scale, opacity };
    });
    return (
      <View style={styles.container}>
        <StyledMapView
          ref={(map) => {
            this.map = map;
          }}
          initialRegion={this.state.region}
          showsUserLocation
        >
          {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            };
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            };
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles.ring, scaleStyle]} />
                  <View style={styles.marker} />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </StyledMapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          {this.state.markers.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={marker.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>
                  {marker.title}
                </Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {marker.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
}

export default Location;
