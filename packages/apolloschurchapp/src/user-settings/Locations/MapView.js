import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated } from 'react-native';
import RNMapView, { Marker } from 'react-native-maps';
import Color from 'color';
import { debounce } from 'lodash';

import {
  TouchableScale,
  Card,
  CardContent,
  ChannelLabel,
  UIText,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';
import CampusCard, { CARD_WIDTH } from './CampusCard';

const ContainerView = styled({
  flex: 1,
})(View);

const FlexedMapView = styled({ flex: 1 })(({ mapRef, ...props }) => (
  <RNMapView ref={mapRef} {...props} />
));

const getCampusAddress = campus =>
  `${campus.street1}\n${campus.city}, ${campus.state} ${campus.postalCode}`;

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

class MapView extends Component {
  static propTypes = {
    campuses: PropTypes.arrayOf(
      PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      })
    ),
    initialRegion: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      latitudeDelta: PropTypes.number,
      longitudeDelta: PropTypes.number,
    }).isRequired,
    userLocation: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    theme: PropTypes.shape({
      sizing: PropTypes.shape({
        baseUnit: PropTypes.number,
      }),
    }),
  };

  animation = new Animated.Value(0);

  componentDidMount() {
    this.animation.addListener(debounce(this.updateCoordinates));
    this.updateCoordinates({ value: 0 });
  }

  get contentContainerStyle() {
    return { paddingHorizontal: this.props.theme.sizing.baseUnit };
  }

  updateCoordinates = ({ value }) => {
    const cardIndex = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item;
    const campus = this.props.campuses[cardIndex];
    if (!campus) return;

    const { userLocation } = this.props;

    let { latitude } = campus;
    const { longitude } = campus;
    let { latitudeDelta, longitudeDelta } = this.props.initialRegion;

    if (userLocation) {
      // Calculate rectangle that shows user's location in the view with campus at center
      const minLat = Math.min(campus.latitude, userLocation.latitude);
      const maxLat = Math.max(campus.latitude, userLocation.latitude);
      const minLong = Math.min(campus.longitude, userLocation.longitude);
      const mayLong = Math.max(campus.longitude, userLocation.longitude);

      latitudeDelta = (maxLat - minLat) * 2.5;
      longitudeDelta = (mayLong - minLong) * 2.5;
    }

    // Now, we need to transform the given lat/lng/delta up to make room for cards at bottom.
    // To make this math simpler, we'll assume the cards take up roughly 30% of the vertical space
    const maxDelta = Math.max(latitudeDelta, longitudeDelta);
    latitude -= maxDelta * 0.3; // move the view up 30%
    latitudeDelta *= 1.3; // include 30% more area in the view

    this.map.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      },
      350
    );
  };

  render() {
    const { campuses = [] } = this.props;
    const interpolations = campuses.map((marker, index) => {
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
        <ContainerView>
          <FlexedMapView
            initialRegion={this.props.initialRegion}
            showsUserLocation
            mapRef={map => {
              this.map = map;
            }}
          >
            {campuses.map((campus, index) => {
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
                <Marker key={campus.id} coordinate={campus}>
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
          </FlexedMapView>
          <ScrollingView>
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH}
              snapToAlignment="left"
              decelerationRate="fast"
              contentContainerStyle={this.contentContainerStyle}
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
            >
              {campuses.map(campus => (
                <CampusCard
                  key={campus.id}
                  distance={campus.distanceFromLocation}
                  title={campus.name}
                  description={getCampusAddress(campus)}
                  images={[campus.image]}
                />
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
      </ContainerView>
    );
  }
}

export default withTheme()(MapView);
