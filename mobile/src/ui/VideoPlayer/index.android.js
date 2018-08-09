import React, { PureComponent } from 'react';
import { Modal } from 'react-native';
import PropTypes from 'prop-types';
import { default as Video } from 'react-native-video-controls'; // eslint-disable-line import/no-named-default

import ProgressiveImage from '/mobile/ui/ProgressiveImage';

import {
  VideoWrapper,
  PlayButton,
  AndroidPositioningFix,
  PlayIcon,
} from './styles';

class VideoPlayer extends PureComponent {
  static propTypes = {
    source: PropTypes.shape({
      uri: PropTypes.string.isRequired,
    }).isRequired,
    thumbnail: PropTypes.string.isRequired,
  };

  constructor() {
    super();

    this.state = { modalVisible: false };
  }

  handleOnPress = () => {
    this.setState({ modalVisible: true });
  };

  handleOnRequestClose = () => this.setState({ modalVisible: false });

  render() {
    const { source, thumbnail, ...otherProps } = this.props;
    return (
      <VideoWrapper>
        <PlayButton onPress={this.handleOnPress}>
          <AndroidPositioningFix>
            <PlayIcon />
          </AndroidPositioningFix>
        </PlayButton>
        {/* TODO: decide what to do about Image styling */}
        <ProgressiveImage source={thumbnail} style={{ aspectRatio: 16 / 9 }} />
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={this.handleOnRequestClose}
          animationType={'fade'}
          hardwareAccelerated
        >
          <Video
            source={source}
            onEnd={this.handleOnRequestClose}
            onBack={this.handleOnRequestClose}
            onAudioBecomingNoisy={this.handleOnRequestClose}
            onError={this.handleOnRequestClose} // set state to paused and exit native player TODO: consider retrying
            playInBackground
            disableFullscreen // hides unused fullscreen player button
            {...otherProps}
          />
        </Modal>
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
