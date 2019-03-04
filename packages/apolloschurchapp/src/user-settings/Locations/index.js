import React, { PureComponent } from 'react';
import { Dimensions, View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import MapView, { Marker } from 'react-native-maps';
import Color from 'color';
import { debounce } from 'lodash';

import {
  PaddedView,
  ButtonLink,
  TouchableScale,
  Card,
  CardContent,
  ChannelLabel,
  UIText,
  styled,
  // ThumbnailCard,
} from '@apollosproject/ui-kit';
import CampusCard from './CampusCard';

const { width } = Dimensions.get('window');

const CARD_WIDTH = width * 0.94;

const endPadding = {
  paddingRight: width - CARD_WIDTH,
};

const ContainerView = styled({
  flex: 1,
})(View);

const ScrollingView = styled({
  position: 'absolute',
  minHeight: '30%',
  bottom: 5,
  left: 0,
  right: 0,
})(View);

const MarkerView = styled(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: Color(theme.colors.primary).fade(theme.alpha.medium),
}))(View);

const MarkerWrapView = styled({
  alignItems: 'center',
  justifyContent: 'center',
})(View);

// This is not good. Is there a better way to prevent cascading styles?

const MarkerRingView = styled(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: 12,
  right: -8,
  top: -8,
  backgroundColor: Color(theme.colors.primary).fade(theme.alpha.low),
  position: 'absolute',
  borderWidth: 1,
  borderColor: Color(theme.colors.primary).fade(theme.alpha.medium),
  alignItems: 'stretch',
}))(View);

const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (e) => reject(e)
    );
  });

class Location extends PureComponent {
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
      longitudeDelta: PropTypes.number,
    }),
    campuses: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.number,
    }),
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

  constructor() {
    super();
    this.index = 0;
    this.animation = new Animated.Value(0);
    this.state = {
      markers: [
        {
          name: 'Aiken',
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
          name: 'Anderson',
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
          name: 'Charleston',
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
          name: 'Clemson',
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
          name: 'Columbia',
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
          name: 'Florence',
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
          name: 'Greenville',
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
          name: 'Greenwood',
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
          name: 'Hilton Head',
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
          name: 'Myrtle Beach',
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
          name: 'Northeast Columbia',
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
          name: 'Powdersville',
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
          name: 'Rock Hill',
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
          name: 'Spartanburg',
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
  }

  componentDidMount() {
    return getCurrentLocation().then((position) => {
      if (position) {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 4,
            longitudeDelta: 0.4,
          },
        });
      }
      this.map.animateToRegion({
        latitude: this.state.region.latitude,
        longitude: this.state.region.longitude,
        latitudeDelta: this.state.region.latitudeDelta,
        longitudeDelta: this.state.region.longitudeDelta,
      });
      this.animation.addListener(debounce(this.updateCoordinates));
    });
  }

  updateCoordinates = ({ value }) => {
    const cardIndex = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
    const { coordinate } = this.state.markers[cardIndex];
    this.map.animateToRegion(
      {
        ...coordinate,
        latitudeDelta: this.state.region.latitudeDelta,
        longitudeDelta: this.state.region.longitudeDelta,
      },
      350
    );
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
      <ContainerView>
        {/* I've been unable to figure out why the MapView component does not render correctly
          when it is a styled component, so there is an inline style for now. */}
        <MapView
          ref={(map) => {
            this.map = map;
            return this.map;
          }}
          style={{ flex: 1 }}
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
              <Marker key={marker.id} coordinate={marker.coordinate}>
                <MarkerWrapView>
                  <Animated.View style={opacityStyle}>
                    <MarkerRingView>
                      <Animated.View style={scaleStyle} />
                    </MarkerRingView>
                    <MarkerView />
                  </Animated.View>
                </MarkerWrapView>
              </Marker>
            );
          })}
        </MapView>
        <ScrollingView>
          <Animated.ScrollView
            horizontal
            scrollEventThrottle={1}
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
            contentContainerStyle={endPadding}
          >
            {this.state.markers.map((marker) => (
              <ContainerView key={marker.id}>
                <CampusCard
                  key={marker.id}
                  distance={marker.distance}
                  title={marker.name}
                  description={marker.description}
                  images={[marker.image]}
                />
              </ContainerView>
            ))}
          </Animated.ScrollView>
          <TouchableScale>
            <Card>
              <CardContent>
                <ChannelLabel label={<UIText bold>{`Select Campus`}</UIText>} />
              </CardContent>
            </Card>
          </TouchableScale>
        </ScrollingView>
      </ContainerView>
    );
  }
}

export default Location;
