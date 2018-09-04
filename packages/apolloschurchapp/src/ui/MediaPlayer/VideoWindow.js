import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import { get } from 'lodash';
import Video from 'react-native-video';
import { Animated, View, StyleSheet } from 'react-native';

import styled from 'apolloschurchapp/src/ui/styled';
import ActivityIndicator from 'apolloschurchapp/src/ui/ActivityIndicator';

import { getVideoState } from './queries';
import { pause as pauseMutation } from './mutations';

const styles = StyleSheet.create({
  animatedPosterImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});

const Background = styled(({ theme }) => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: theme.colors.black,
}))(View);

/**
 * The VideoWindow displays the actual react-native-video component.
 * It's responsible for loading the video, and updating progress + duration in state.
 */
class VideoWindow extends PureComponent {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func,
    }),
    onProgress: PropTypes.func,
    onLoad: PropTypes.func,
  };

  loadingOverlay = new Animated.Value(1);

  loadingStyle = [StyleSheet.absoluteFill, { opacity: this.loadingOverlay }];

  handlePause = () => {
    this.props.client.mutate({ mutation: pauseMutation });
  };

  handleProgress = (progress) => {
    if (this.props.onProgress) this.props.onProgress(progress);
  };

  handleError = (...args) => {
    console.log('player error', args);
    this.handlePause();
  };

  handleLoad = ({ duration }) => {
    Animated.spring(this.loadingOverlay, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    if (this.props.onLoad) this.props.onLoad({ duration });
  };

  handleLoadStart = () => {
    Animated.spring(this.loadingOverlay, {
      toValue: 1,
      useNativeDriver: true,
    });
  };

  setVideoRef = (element) => {
    this.video = element;
  };

  renderVideo = ({ data: { mediaPlayer = {} } = {} }) => {
    if (!get(mediaPlayer, 'currentTrack.mediaSource')) return null;
    return [
      <Video
        ref={this.setVideoRef}
        source={mediaPlayer.currentTrack.mediaSource}
        paused={!mediaPlayer.isPlaying}
        audioOnly={!mediaPlayer.currentTrack.isVideo}
        ignoreSilentSwitch={'ignore'}
        allowsExternalPlayback
        playInBackground
        playWhenInactive
        onAudioBecomingNoisy={this.handlePause}
        onEnd={this.handlePause}
        onError={this.handleError}
        resizeMode={'contain'}
        onLoadStart={this.handleLoadStart}
        onLoad={this.handleLoad}
        onProgress={this.handleProgress}
        style={StyleSheet.absoluteFill}
        repeat
        key="video"
      />,
      // there's currently a bug on android where react-native-video's poster doesn't ever go away
      // So we use our own image copmonent...which is nicer cuz we can show a nice fading animation too!
      <Animated.Image
        key="poster"
        style={[
          styles.animatedPosterImage,
          mediaPlayer.currentTrack.isVideo ? this.loadingStyle : {},
        ]}
        source={mediaPlayer.currentTrack.posterSources}
      />,
    ];
  };

  render() {
    return (
      <Background>
        <Query query={getVideoState}>{this.renderVideo}</Query>
        <Animated.View style={this.loadingStyle}>
          <ActivityIndicator />
        </Animated.View>
      </Background>
    );
  }
}

export default withApollo(VideoWindow);
