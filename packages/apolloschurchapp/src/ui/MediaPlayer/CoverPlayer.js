import React, { Component } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';

// we use a JS-only version of SafeAreaView as we can force bottom inset, which improves render efficiency
import SafeAreaView from 'react-native-safe-area-view';

import styled from '../styled';

import MiniControls, { MINI_PLAYER_HEIGHT } from './MiniControls';
import FullscreenControls from './FullscreenControls';
import VideoWindow from './VideoWindow';

const VideoSizer = styled(
  ({ isFullscreen }) =>
    isFullscreen
      ? StyleSheet.absoluteFill
      : { height: MINI_PLAYER_HEIGHT, aspectRatio: 16 / 9 }
)(View);

const getVisibilityState = gql`
  query {
    mediaPlayer @client {
      isVisible
      isFullscreen
    }
  }
`;

const exitFullscreen = gql`
  mutation {
    mediaPlayerUpdateState(isFullscreen: false) @client
  }
`;

const goFullscreen = gql`
  mutation {
    mediaPlayerUpdateState(isFullscreen: true) @client
  }
`;

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
    { transform: [{ translateY: this.coverTranslateY }] },
  ];

  miniControlsAnimation = {
    opacity: this.fullScreenWithOffset.interpolate({
      inputRange: [0, 0.1],
      outputRange: [1, 0],
    }),
    transform: [{ translateY: this.miniControlsTranslateY }],
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
      this.dragOffset.setValue(
        Math.min(0, -dy / Dimensions.get('window').height)
      );
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

      Animated.spring(this.dragOffset, {
        toValue: 0,
        overshootClamping: true,
        useNativeDriver: true,
      }).start();

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

    Animated.spring(this.fullscreen, {
      toValue: isFullscreen ? 1 : 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();

    const coverFlow = [
      <Animated.View
        key="cover"
        onLayout={this.handleCoverLayout}
        style={this.coverStyle}
        {...this.panResponder.panHandlers}
      >
        <VideoSizer isFullscreen={isFullscreen}>
          <VideoWindow />
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
          <SafeAreaView forceInset={{ bottom: 'always', top: 'never' }}>
            <MiniControls />
          </SafeAreaView>
        </Animated.View>
      );
    }

    return coverFlow;
  };

  render() {
    return <Query query={getVisibilityState}>{this.renderCover}</Query>;
  }
}

export default withApollo(CoverPlayer);
