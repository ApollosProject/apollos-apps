import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Animated } from 'react-native';
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

const getCampusAddress = (campus) =>
  `${campus.street1}\n${campus.street2 ? `${campus.street2}\n` : null}${
    campus.city
  }, ${campus.state} ${campus.postalCode}`;

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
  };

  animation = new Animated.Value(0);

  componentDidMount() {
    this.animation.addListener(debounce(this.updateCoordinates));
    this.updateCoordinates({ value: 0 });
  }

  updateCoordinates = ({ value }) => {
    const cardIndex = Math.floor(value / CARD_WIDTH);
    const campus = this.props.campuses[cardIndex];
    if (!campus) return;

    const { userLocation } = this.props;

    const { latitude, longitude } = campus;
    let { latitudeDelta, longitudeDelta } = this.props.initialRegion;

    if (userLocation) {
      // Calculate rectangle that shows user's location in the view with campus at center
      const minX = Math.min(campus.latitude, userLocation.latitude);
      const maxX = Math.max(campus.latitude, userLocation.latitude);
      const minY = Math.min(campus.longitude, userLocation.longitude);
      const maxY = Math.max(campus.longitude, userLocation.longitude);

      latitudeDelta = (maxX - minX) * 2.5;
      longitudeDelta = (maxY - minY) * 2.5;
    }

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
          {/* I've been unable to figure out why the MapView component does not render correctly
                    when it is a styled component, so there is an inline style for now. */}
          <RNMapView
            style={{ flex: 1 }}
            initialRegion={this.props.initialRegion}
            showsUserLocation
            ref={(map) => {
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
          </RNMapView>
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
              {campuses.map((campus) => (
                <ContainerView key={campus.id}>
                  <CampusCard
                    distance={campus.distanceFromLocation}
                    title={campus.name}
                    description={getCampusAddress(campus)}
                    images={[campus.image]}
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
      </ContainerView>
    );
  }
}

export default MapView;
