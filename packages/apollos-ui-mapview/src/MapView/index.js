import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RNMapView from 'react-native-maps';
import { Animated, Dimensions, Platform, PixelRatio } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { debounce } from 'lodash';

import {
  Button,
  Touchable,
  PaddedView,
  FlexedView,
  styled,
  withTheme,
  CampusCard,
  withIsLoading,
} from '@apollosproject/ui-kit';
import { MediaPlayerSpacer } from '@apollosproject/ui-media-player';

import Marker from '../Marker';

export const FlexedMapView = styled({ flex: 1 })(({ mapRef, ...props }) => (
  <RNMapView ref={mapRef} {...props} />
));

const Footer = styled(
  {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  'ui-mapview.MapView.Footer'
)(SafeAreaView);

const StyledCampusCard = styled(
  ({ theme, cardWidth }) => ({
    width: cardWidth,
    marginHorizontal: theme.sizing.baseUnit / 4,
  }),
  'ui-mapview.MapView.StyledCampusCard'
)(CampusCard);

class MapView extends Component {
  static propTypes = {
    campuses: PropTypes.arrayOf(
      PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      })
    ),
    currentCampus: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    onLocationSelect: PropTypes.func.isRequired,
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
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
    }),
    // eslint-disable-next-line react/no-unused-prop-types
    Marker: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    isLoading: PropTypes.bool,
    isLoadingSelectedCampus: PropTypes.bool,
  };

  static defaultProps = {
    Marker,
  };

  constructor(props) {
    super();
    // sets width of cards to be full width of the screen minus a bit for spacing
    this.cardWidth =
      Dimensions.get('window').width - props.theme.sizing.baseUnit * 2.25;

    this.animation = new Animated.Value(0);
    this.scrollView = null;

    // We need to cache this value in state, because otherwise the campus order changes
    // After selecting a campus, but before the home feed loads.
    this.state = { currentCampus: null };

    this.cardScrollPositionOffset =
      this.cardWidth + props.theme.sizing.baseUnit * 0.5;
  }

  componentDidMount() {
    this.animation.addListener(debounce(this.updateCoordinates));
  }

  componentDidUpdate(oldProps) {
    // update mapview if there are campuses and the location changes
    if (this.props.currentCampus && !this.state.currentCampus) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ currentCampus: this.props.currentCampus });
    }
    if (
      this.props.campuses.length &&
      oldProps.userLocation !== this.props.userLocation
    ) {
      this.updateCoordinates({ value: this.previousScrollPosition });
    }
  }

  componentWillUnmount() {
    this.animation.removeListener(this.updateCoordinates);
  }

  get currentCampus() {
    const cardIndex = Math.floor(
      this.previousScrollPosition / this.cardWidth + 0.3
    ); // animate 30% away from landing on the next item;
    return this.sortedCampuses[cardIndex];
  }

  get sortedCampuses() {
    const { campuses = [] } = this.props;
    const { currentCampus } = this.state;
    if (!currentCampus) {
      return campuses;
    }
    return [
      campuses.find(({ id }) => id === currentCampus.id),
      ...campuses.filter(({ id }) => id !== currentCampus.id),
    ];
  }

  getCampusAddress = (campus) =>
    `${campus.street1}\n${campus.city}, ${campus.state} ${campus.postalCode}`;

  scrollToIndex = (index) => {
    const cardScrollPosition = index * this.cardScrollPositionOffset;

    this.scrollView.getNode().scrollTo({
      x: cardScrollPosition,
      y: 0,
      animated: true,
    });
    this.updateCoordinates({ value: cardScrollPosition });
  };

  updateCoordinates = ({ value }) => {
    this.previousScrollPosition = value;

    const { userLocation } = this.props;
    // campus card height + some padding

    const bottomPadding = this.props.theme.sizing.baseUnit * 18.25;
    const edgePadding = {
      top: this.props.theme.sizing.baseUnit * 6.25,
      left: this.props.theme.sizing.baseUnit * 6.25,
      right: this.props.theme.sizing.baseUnit * 6.25,
      bottom:
        Platform.OS === 'android'
          ? // NOTE: android bug
            // https://github.com/react-native-community/react-native-maps/issues/2543
            PixelRatio.getPixelSizeForLayoutSize(bottomPadding)
          : bottomPadding,
    };

    const visibleCampuses = [
      userLocation,
      ...(this.currentCampus ? [this.currentCampus] : this.sortedCampuses),
    ];

    this.map.fitToCoordinates(visibleCampuses, {
      edgePadding,
    });
  };

  render() {
    const { onLocationSelect, isLoading, isLoadingSelectedCampus } = this.props;
    const interpolations = this.sortedCampuses.map((marker, index) => {
      const inputRange = [
        (index - 1) * this.cardWidth,
        index * this.cardWidth,
        (index + 1) * this.cardWidth,
      ];
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: 'clamp',
      });
      return { opacity };
    });

    return (
      <FlexedView>
        <FlexedMapView
          initialRegion={this.props.initialRegion}
          showsUserLocation
          mapRef={(map) => {
            this.map = map;
          }}
        >
          {this.sortedCampuses.map((campus, index) => {
            const campusOpacity = {
              opacity: interpolations[index].opacity,
            };
            return (
              <this.props.Marker
                onPress={() => this.scrollToIndex(index)}
                key={campus.id}
                opacityStyle={campusOpacity}
                latitude={campus.latitude}
                longitude={campus.longitude}
              />
            );
          })}
        </FlexedMapView>
        <Footer>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={this.cardScrollPositionOffset}
            snapToAlignment={'start'}
            decelerationRate={'fast'}
            contentContainerStyle={{
              paddingHorizontal: this.props.theme.sizing.baseUnit * 0.75,
            }}
            ref={(ref) => (this.scrollView = ref)} // eslint-disable-line
            scrollEventThrottle={16} // roughtly 1000ms/60fps = 16ms
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
            {this.sortedCampuses.map((campus) => (
              <Touchable
                key={campus.id}
                onPress={() => onLocationSelect(campus)}
              >
                <StyledCampusCard
                  distance={campus.distanceFromLocation}
                  title={campus.name}
                  description={this.getCampusAddress(campus)}
                  images={[campus.image]}
                  cardWidth={this.cardWidth}
                  isLoading={isLoading}
                />
              </Touchable>
            ))}
          </Animated.ScrollView>
          <MediaPlayerSpacer>
            <PaddedView>
              <Button
                title="Select Campus"
                pill={false}
                type="secondary"
                onPress={() =>
                  onLocationSelect(this.currentCampus || this.sortedCampuses[0])
                }
                loading={isLoadingSelectedCampus}
              />
            </PaddedView>
          </MediaPlayerSpacer>
        </Footer>
      </FlexedView>
    );
  }
}

export default withTheme()(withIsLoading(MapView));
