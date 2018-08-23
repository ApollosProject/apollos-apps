import React, { Component } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

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

class CoverPlayer extends Component {
  fullscreen = new Animated.Value(0);

  miniControlHeight = new Animated.Value(MINI_PLAYER_HEIGHT);

  coverHeight = new Animated.Value(Dimensions.get('window').height);

  coverTranslateY = (() => {
    const translateYWhenCollapsed = Animated.subtract(
      this.coverHeight,
      this.miniControlHeight
    );

    const translateYSlope = Animated.multiply(
      translateYWhenCollapsed,
      Animated.multiply(this.fullscreen, -1)
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
      Animated.multiply(this.fullscreen, -1)
    );
    return translateYSlope;
  })();

  coverStyle = [
    StyleSheet.absoluteFill,
    { transform: [{ translateY: this.coverTranslateY }] },
  ];

  miniControlsAnimation = {
    opacity: this.fullscreen.interpolate({
      inputRange: [0, 0.5],
      outputRange: [1, 0],
    }),
    transform: [{ translateY: this.miniControlsTranslateY }],
  };

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
      >
        <VideoSizer isFullscreen={isFullscreen}>
          <VideoWindow />
        </VideoSizer>
        <FullscreenControls />
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

export default CoverPlayer;
