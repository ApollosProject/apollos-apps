import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Video from 'react-native-video';

import ProgressiveImage from '/mobile/ui/ProgressiveImage';

import { VideoWrapper, PlayButton, PlayIcon } from './styles';

class VideoPlayer extends PureComponent {
  static propTypes = {
    source: PropTypes.shape({
      uri: PropTypes.string.isRequired,
    }).isRequired,
    thumbnail: PropTypes.string.isRequired,
  };

  constructor() {
    super();

    this.state = { paused: true };
  }

  setVideoRef = (element) => {
    this.video = element;
  };

  handleOnPress = () => {
    this.video.presentFullscreenPlayer();
  };

  handleTogglePaused = () => {
    this.setState((prevState) => ({ paused: !prevState.paused }));
  };

  handleOnEnd = () => {
    this.handleTogglePaused();
    this.video.dismissFullscreenPlayer();
  };

  render() {
    const { source, thumbnail, ...otherProps } = this.props;

    return (
      <VideoWrapper>
        <PlayButton onPress={this.handleOnPress}>
          <PlayIcon />
        </PlayButton>
        {/* TODO: decide what to do about Image styling */}
        <ProgressiveImage source={thumbnail} style={{ aspectRatio: 16 / 9 }} />
        <Video
          ref={this.setVideoRef}
          source={source}
          paused={this.state.paused}
          onFullscreenPlayerDidPresent={this.handleTogglePaused}
          onFullscreenPlayerDidDismiss={this.handleTogglePaused}
          onEnd={this.handleOnEnd}
          onAudioBecomingNoisy={this.handleTogglePaused}
          ignoreSilentSwitch={'ignore'}
          playInBackground
          playWhenInactive
          {...otherProps}
        />
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
