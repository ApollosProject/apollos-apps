import React, { Component } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import { get } from 'lodash';
import DeviceInfo from 'react-native-device-info';

import styled from 'apolloschurchapp/src/ui/styled';

import MiniControls, { MINI_PLAYER_HEIGHT } from './MiniControls';
import FullscreenControls from './FullscreenControls';
import VideoWindow from './VideoWindow';

import { getFullVisibilityState } from './queries';
import { exitFullscreen, goFullscreen } from './mutations';
import { Provider, ControlsConsumer } from './PlayheadState';

const VideoSizer = styled(
  ({ isFullscreen, isVideo, theme }) =>
    isFullscreen
      ? StyleSheet.absoluteFill
      : {
          height: MINI_PLAYER_HEIGHT,
          borderTopLeftRadius: theme.sizing.borderRadius,
          borderBottomLeftRadius: theme.sizing.borderRadius,
          overflow: 'hidden',
          aspectRatio: isVideo ? 16 / 9 : 1,
        }
)(View);

const isPhoneX = DeviceInfo.getModel() === 'iPhone X';
export const BOTTOM_OFFSET = isPhoneX ? 25 : 10;

/**
 * CoverPlayer is a animating media player that transitions between
 * a mini state and a full screen state.
 * It is capable of playing any type of media that react-native-video supports.
 * It reads from local graphql state, and so you must use graphql mutations to play tracks.
 */
class CoverPlayer extends Component {
  static propTypes = {
    client: PropTypes.shape({ mutate: PropTypes.func }),
  };

  fullscreen = new Animated.Value(0);

  miniControlHeight = new Animated.Value(MINI_PLAYER_HEIGHT);

  coverHeight = new Animated.Value(Dimensions.get('window').height);

  dragOffset = new Animated.Value(0);

  fullScreenWithOffset = Animated.add(this.fullscreen, this.dragOffset);

  coverTranslateY = (() => {
    const translateYWhenCollapsed = Animated.subtract(
      this.coverHeight,
      this.miniControlHeight
    );

    const translateYSlope = Animated.multiply(
      translateYWhenCollapsed,
      Animated.multiply(this.fullScreenWithOffset, -1)
    );

    const translateY = Animated.add(translateYSlope, translateYWhenCollapsed);
    return translateY;
  })();

  miniControlsTranslateY = (() => {
    const translateYWhenExpanded = Animated.subtract(
      this.coverHeight,
      this.miniControlHeight
    );
    const translateYSlope = Animated.multiply(
      translateYWhenExpanded,
      Animated.multiply(this.fullScreenWithOffset, -1)
    );
    return translateYSlope;
  })();

  coverStyle = [
    StyleSheet.absoluteFill,
    {
      transform: [{ translateY: this.coverTranslateY }],
    },
  ];

  miniControlsAnimation = {
    opacity: this.fullScreenWithOffset.interpolate({
      inputRange: [0, 0.1],
      outputRange: [1, 0],
    }),
  };

  fullscreenControlsAnimation = [
    StyleSheet.absoluteFill,
    {
      opacity: this.fullScreenWithOffset.interpolate({
        inputRange: [0, 0.1],
        outputRange: [0, 1],
      }),
    },
  ];

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (event, { dx, dy }) =>
      Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10,

    onPanResponderMove: (event, { dy }) => {
      const dragOffset = Math.min(0, -dy / Dimensions.get('window').height);
      this.dragOffset.setValue(dragOffset);
    },

    onPanResponderRelease: (event, { dy, vy }) => {
      const { height } = Dimensions.get('window');
      const gestureVelocity = vy;
      const gestureDistance = Math.abs(dy);

      let mutation = goFullscreen;

      if (Math.abs(gestureVelocity > 0.5)) {
        if (gestureVelocity > 0) {
          mutation = exitFullscreen;
        }
      } else if (gestureDistance >= height / 2) {
        mutation = exitFullscreen;
      }

      const dragOffset = Math.min(0, -dy / Dimensions.get('window').height);

      if (mutation === goFullscreen) {
        Animated.spring(this.dragOffset, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      } else {
        this.dragOffset.setValue(0);
        this.fullscreen.setValue(dragOffset);
      }

      this.props.client.mutate({ mutation });
    },
  });

  handleCoverLayout = Animated.event([
    { nativeEvent: { layout: { height: this.coverHeight } } },
  ]);

  handleMiniControlLayout = Animated.event([
    { nativeEvent: { layout: { height: this.miniControlHeight } } },
  ]);

  shouldComponentUpdate() {
    return false;
  }

  renderCover = ({ data: { mediaPlayer = {} } = {} }) => {
    const { isFullscreen = false } = mediaPlayer;

    const fullscreenStyles = {
      margin: isFullscreen ? 0 : 10,
      marginBottom: isFullscreen ? 0 : BOTTOM_OFFSET,
    };

    Animated.spring(this.fullscreen, {
      toValue: isFullscreen ? 1 : 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();

    const coverFlow = [
      <Animated.View
        key="cover"
        onLayout={this.handleCoverLayout}
        style={StyleSheet.absoluteFill}
      >
        <VideoSizer
          isFullscreen={isFullscreen}
          isVideo={get(mediaPlayer, 'currentTrack.isVideo')}
        >
          <ControlsConsumer>
            {(controlHandlers) => <VideoWindow {...controlHandlers} />}
          </ControlsConsumer>
        </VideoSizer>
        <Animated.View style={this.fullscreenControlsAnimation}>
          <FullscreenControls />
        </Animated.View>
      </Animated.View>,
    ];

    if (!isFullscreen) {
      coverFlow.push(
        <Animated.View
          key="mini-controls"
          style={this.miniControlsAnimation}
          onLayout={this.handleMiniControlLayout}
        >
          <MiniControls />
        </Animated.View>
      );
    }

    return (
      <Animated.View style={[this.coverStyle, fullscreenStyles]}>
        {coverFlow}
      </Animated.View>
    );
  };

  render() {
    return (
      <Provider>
        <Query query={getFullVisibilityState}>{this.renderCover}</Query>
      </Provider>
    );
  }
}

export default withApollo(CoverPlayer);
