import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';
import { get } from 'lodash';
import Video from 'react-native-video';
import { View, StyleSheet } from 'react-native';
import styled from '../styled';

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

  _needsSeekOnPlay = false;

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
    this.props.client.mutate({
      mutation: updateDuration,
      variables: { duration },
    });
  };

  setVideoRef = (element) => {
    this.video = element;
  };

  renderVideo = ({ data: { mediaPlayer = {} } = {} }) => {
    if (!get(mediaPlayer, 'currentTrack.mediaSource')) return null;
    return (
      <Video
        ref={this.setVideoRef}
        source={mediaPlayer.currentTrack.mediaSource}
        paused={!mediaPlayer.isPlaying}
        ignoreSilentSwitch={'ignore'}
        allowsExternalPlayback
        playInBackground
        playWhenInactive
        onAudioBecomingNoisy={this.handlePause}
        onEnd={this.handlePause}
        onError={this.handlePause}
        resizeMode={'contain'}
        poster={get(mediaPlayer, 'posterSources[0].uri')}
        posterResizeMode={'cover'}
        onProgress={this.handleProgress}
        onLoad={this.handleLoad}
        style={StyleSheet.absoluteFill}
        repeat
      />
    );
  };

  render() {
    return (
      <Background>
        <Query query={getVideoState}>{this.renderVideo}</Query>
      </Background>
    );
  }
}

export default withApollo(VideoWindow);
