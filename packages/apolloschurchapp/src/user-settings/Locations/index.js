import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import MapView, { Marker } from 'react-native-maps';

import {
  PaddedView,
  ButtonLink,
  TouchableScale,
  Card,
  CardContent,
  ChannelLabel,
  UIText,
  // ThumbnailCard,
} from '@apollosproject/ui-kit';
import CampusCard from './CampusCard';

const { width, height } = Dimensions.get('window');

const CARD_HEIGHT = height / 4.5;
const CARD_WIDTH = CARD_HEIGHT + 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: 'absolute',
    minHeight: '30%',
    bottom: 5,
    left: 0,
    right: 0,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
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

  state = {
    markers: [
      {
        title: 'Aiken',
        coordinate: {
          latitude: 33.5664789,
          longitude: -81.7465594,
        },
        distance: 12,
        id: 0,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/aiken/NSC23471.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Anderson',
        coordinate: {
          latitude: 34.595434,
          longitude: -82.6244131,
        },
        id: 1,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/Anderson.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Charleston',
        coordinate: {
          latitude: 32.914992,
          longitude: -80.1035458,
        },
        id: 2,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/locations_chs.2x1.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Clemson',
        coordinate: {
          latitude: 34.68901,
          longitude: -82.8589537,
        },
        id: 3,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/clemson/CLE_22x1_-100.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Columbia',
        coordinate: {
          latitude: 34.030309,
          longitude: -81.098607,
        },
        id: 4,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/columbia/2x1lexcola.png',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Florence',
        coordinate: {
          latitude: 34.2121752,
          longitude: -79.7992434,
        },
        id: 5,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/florence/FLO2x1_-100.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Greenville',
        coordinate: {
          latitude: 34.852042,
          longitude: -82.3567597,
        },
        id: 6,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/Greenville2x1.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Greenwood',
        coordinate: {
          latitude: 34.2140468,
          longitude: -82.1496785,
        },
        id: 7,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/Greenwood2x1.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Hilton Head',
        coordinate: {
          latitude: 32.2722634,
          longitude: -80.9448838,
        },
        id: 8,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/HHdoors.jpeg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Myrtle Beach',
        coordinate: {
          latitude: 33.7159127,
          longitude: -78.9272232,
        },
        id: 9,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/locations_myr.2x1.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Northeast Columbia',
        coordinate: {
          latitude: 34.1109545,
          longitude: -80.883067,
        },
        id: 10,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/columbia/hero.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Powdersville',
        coordinate: {
          latitude: 34.7877695,
          longitude: -82.4856855,
        },
        id: 11,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/pow_launch_8.7.16_web-2.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Rock Hill',
        coordinate: {
          latitude: 34.950421,
          longitude: -81.0898858,
        },
        id: 12,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/rock_hill/RKH_22x1_-100.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
      {
        title: 'Spartanburg',
        coordinate: {
          latitude: 34.9331235,
          longitude: -81.9966683,
        },
        id: 13,
        image: {
          uri:
            'https://s3.amazonaws.com/ns.images/all/heroes/newspring/campuses/campus.spartanburg.2x1.jpg',
        },
        description: 'This is a NewSpring Campus',
      },
    ],
    region: {
      latitude: 34.00115,
      longitude: -81.032393,
      latitudeDelta: 4,
      longitudeDelta: 0.4,
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

  componentDidMount = () => {
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
  };

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
        <MapView
          ref={(map) => {
            this.map = map;
            return this.map;
          }}
          style={styles.container}
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
              <Marker key={index} coordinate={marker.coordinate}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles.ring, scaleStyle]} />
                  <View style={styles.marker} />
                </Animated.View>
              </Marker>
            );
          })}
        </MapView>
        <View style={styles.scrollView}>
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
            contentContainerStyle={styles.endPadding}
          >
            {this.state.markers.map((marker) => (
              <View style={styles.container}>
                <CampusCard
                  key={marker.id}
                  distance={marker.distance}
                  title={marker.title}
                  description={marker.description}
                  images={[marker.image]}
                  style={{ position: 'relative' }}
                />
              </View>
            ))}
          </Animated.ScrollView>
          <TouchableScale style={styles.button}>
            <Card>
              <CardContent>
                <ChannelLabel label={<UIText bold>{`Select Campus`}</UIText>} />
              </CardContent>
            </Card>
          </TouchableScale>
        </View>
      </View>
    );
  }
}

export default Location;
