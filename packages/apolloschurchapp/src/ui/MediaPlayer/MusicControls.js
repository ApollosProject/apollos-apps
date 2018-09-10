import PropTypes from 'prop-types';
import React, { Component } from 'react';
import MusicControl from 'react-native-music-control';
import { withApollo, Query } from 'react-apollo';
import { get } from 'lodash';

import { PlayheadConsumer, ControlsConsumer } from './PlayheadState';
import { getMusicControlState } from './queries';
import { play, pause, updatePlayhead } from './mutations';

class MusicControls extends Component {
  static propTypes = {
    currentTrack: PropTypes.shape({}),
    currentTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isPlaying: PropTypes.bool,
    duration: PropTypes.number,
    skip: PropTypes.func,
    client: PropTypes.shape({ mutate: PropTypes.func }),
  };

  componentDidUpdate(oldProps) {
    if (this.props.duration > 1 && oldProps.duration !== this.props.duration) {
      this.setup();
    }
    if (
      oldProps.currentTime !== this.props.currentTime ||
      oldProps.isPlaying !== this.props.isPlaying
    ) {
      this.updatePlayback();
    }
  }

  componentWillUnmount() {
    MusicControl.enableBackgroundMode(false);
    MusicControl.stopControl();
  }

  setup = () => {
    MusicControl.enableBackgroundMode(true);

    // Music Controls does not control audio by itself. It only updates the native UI and conversely
    // fires events when the user takes actions in the native UI. It is up to the app to keep the UI
    // up-to-date (via props) and to handle any action the user takes (via event callbacks).

    // Play
    MusicControl.enableControl('play', true);
    MusicControl.on('play', this.handlePlay);

    // Pause
    MusicControl.enableControl('pause', true);
    MusicControl.on('pause', this.handlePause);

    // Stop. Runs when end of audio is reached.
    MusicControl.enableControl('stop', false);
    MusicControl.on('stop', this.handlePause);

    // Skip this track, go back a track. No queue, so disable.
    MusicControl.enableControl('previousTrack', false);
    MusicControl.enableControl('nextTrack', false);

    // Go forward/backward "seekInterval" seconds
    if (this.props.skip) {
      MusicControl.enableControl('skipForward', true);
      MusicControl.enableControl('skipBackward', true);
      MusicControl.on('skipForward', this.handleFastForward);
      MusicControl.on('skipBackward', this.handleRewind);
    }

    // Scrubber
    MusicControl.enableControl('seek', true); // Android
    MusicControl.enableControl('changePlaybackPosition', true); // iOS
    MusicControl.on('seek', this.handleSeek);
    MusicControl.on('changePlaybackPosition', this.handleSeek);

    // Remote (headphones) play/pause
    MusicControl.enableControl('togglePlayPause', true);
    MusicControl.on(
      'togglePlayPause',
      () => (this.props.isPlaying ? this.handlePause() : this.handlePlay())
    );

    // Remote (headphones) fast forward/rewind (iOS only) (disabled)
    MusicControl.enableControl('seekForward', false);
    MusicControl.enableControl('seekBackward', false);

    // Swipe to dismiss native control, only when paused (Android only)
    MusicControl.enableControl('closeNotification', true, { when: 'paused' });

    // Configure the visuals
    const { currentTrack = {} } = this.props;
    MusicControl.setNowPlaying({
      title: currentTrack.title,
      artist: currentTrack.artist,
      artwork: get(currentTrack, 'posterSources[0].uri'),
      elapsedTime: this.props.currentTime,
      duration: this.props.duration,
    });
  };

  updatePlayback = () => {
    MusicControl.updatePlayback({
      state: this.props.isPlaying
        ? MusicControl.STATE_PLAYING
        : MusicControl.STATE_PAUSED,
      elapsedTime: this.props.currentTime,
    });
  };

  handlePlay = () => this.props.client.mutate({ mutation: play });

  handlePause = () => this.props.client.mutate({ mutation: pause });

  handleFastForward = () => this.props.skip(15);

  handleRewind = () => this.props.skip(-15);

  handleSeek = (seekTo) =>
    this.props.client.mutate({
      mutation: updatePlayhead,
      variables: {
        currentTime: seekTo,
      },
    });

  render() {
    return null;
  }
}

const MusicControlsState = (props) => (
  <Query query={getMusicControlState}>
    {({ data: { mediaPlayer = {} } = {} }) => (
      <PlayheadConsumer>
        {({ duration }) => (
          <ControlsConsumer>
            {({ skip }) => (
              <MusicControls
                {...props}
                duration={duration}
                skip={skip}
                {...mediaPlayer}
              />
            )}
          </ControlsConsumer>
        )}
      </PlayheadConsumer>
    )}
  </Query>
);

export default withApollo(MusicControlsState);
