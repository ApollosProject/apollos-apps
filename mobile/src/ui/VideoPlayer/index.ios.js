import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Video from 'react-native-video';

import { VideoWrapper, PlayButton, PlayIcon, Thumbnail } from './styles';

class VideoPlayer extends PureComponent {
  static propTypes = {
    source: PropTypes.shape({
      uri: PropTypes.string.isRequired,
    }).isRequired,
    thumbnail: PropTypes.oneOfType([
      PropTypes.shape({
        uri: PropTypes.string,
        label: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
      }),
      PropTypes.string,
    ]),
    gradientColor: PropTypes.string,
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
    const { source, thumbnail, gradientColor, ...otherProps } = this.props;

    return (
      <VideoWrapper>
        <Thumbnail source={thumbnail} colors={gradientColor} />
        {source
          ? [
              <PlayButton
                onPress={this.handleOnPress}
                key={'VideoPlayerPlaybutton'}
              >
                <PlayIcon />
              </PlayButton>,
              <Video
                ref={this.setVideoRef}
                source={source}
                paused={this.state.paused}
                onFullscreenPlayerDidPresent={this.handleTogglePaused}
                onFullscreenPlayerDidDismiss={this.handleTogglePaused}
                onAudioBecomingNoisy={this.handleTogglePaused}
                onEnd={this.handleOnEnd}
                onError={this.handleOnEnd} // set state to paused and exit native player TODO: consider retrying
                ignoreSilentSwitch={'ignore'}
                playInBackground
                playWhenInactive
                key={'VideoPlayerObject'}
                {...otherProps}
              />,
            ]
          : null}
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
