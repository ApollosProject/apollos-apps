import React, { PureComponent } from 'react';
import { Dimensions, View, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import MapView, { Marker } from 'react-native-maps';
import Color from 'color';
import { debounce, get } from 'lodash';

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

import getAllCampuses from './getCampusLocations';

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
        {console.log('Before the Query', this.props)};
        <Query
          query={getAllCampuses}
          variables={{
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
          }}
          fetchPolicy="cache-and-network"
        >
          {({ loading, error, data, refetch }) => {
            console.log('This is after the Query', data);
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
                  isLoading={loading}
                  error={error}
                  refetch={refetch}
                >
                  {data.campuses.map((campus, index) => {
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
                      <Marker
                        key={campus.id}
                        coordinate={this.state.coordinates}
                      >
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
                        <ChannelLabel
                          label={<UIText bold>{`Select Campus`}</UIText>}
                        />
                      </CardContent>
                    </Card>
                  </TouchableScale>
                </ScrollingView>
              </ContainerView>
            );
          }}
        </Query>
      </ContainerView>
    );
  }
}

export default Location;
