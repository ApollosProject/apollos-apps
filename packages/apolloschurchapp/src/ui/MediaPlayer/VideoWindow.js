import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';
import { get } from 'lodash';
import Video from 'react-native-video';
import { Animated, View, StyleSheet } from 'react-native';

import styled from 'apolloschurchapp/src/ui/styled';
import ActivityIndicator from 'apolloschurchapp/src/ui/ActivityIndicator';

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

const getVideoState = gql`
  query mediaPlayer {
    mediaPlayer @client {
      currentTrack {
        mediaSource {
          uri
        }
        posterSources {
          uri
        }
        id
        isVideo
      }
      isPlaying
    }
  }
`;

const updateProgress = gql`
  mutation updateProgress(
    $currentTime: Float
    $playableDuration: Float
    $seekableDuration: Float
  ) {
    mediaPlayerNotifyProgress(
      currentTime: $currentTime
      playableDuration: $playableDuration
      seekableDuration: $seekableDuration
    ) @client
  }
`;

const updateDuration = gql`
  mutation updateDuration($duration: Float) {
    mediaPlayerNotifyProgress(duration: $duration) @client
  }
`;

const pauseMutation = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: false) @client
  }
`;

class VideoWindow extends PureComponent {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func,
    }),
  };

  loadingOverlay = new Animated.Value(1);

  loadingStyle = [StyleSheet.absoluteFill, { opacity: this.loadingOverlay }];

  handlePause = () => {
    this.props.client.mutate({ mutation: pauseMutation });
  };

  handleProgress = (progress) => {
    this.props.client.mutate({
      mutation: updateProgress,
      variables: progress,
    });
  };

  handleLoad = ({ duration }) => {
    Animated.spring(this.loadingOverlay, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    this.props.client.mutate({
      mutation: updateDuration,
      variables: { duration },
    });
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
        onError={this.handlePause}
        resizeMode={'contain'}
        onProgress={this.handleProgress}
        progressUpdateInterval={1000}
        onLoadStart={this.handleLoadStart}
        onLoad={this.handleLoad}
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
