import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Video from 'react-native-video'; // eslint-disable-line

import styled from '/mobile/ui/styled';
import Touchable from '/mobile/ui/Touchable';
import Icon from '/mobile/ui/Icon';

const VideoWrapper = styled({
  position: 'relative',
})(View);

const PlayButton = styled({
  ...StyleSheet.absoluteFillObject,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
})(Touchable);

const StyledVideo = styled({
  width: '100%',
})(Video);

class VideoPlayer extends PureComponent {
  static propTypes = {
    source: PropTypes.shape({}),
    isLoading: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.playerProgress = 0; // none 0 <> 1 = complete
  }

  setPlayerRef = (element) => {
    this.player = element;
  };

  handleStartVideo = () => {
    // Only start video from beginning if 90% has already been played.
    if (this.percentPlayed > 0.9) {
      this.player.seek(0);
    }
    this.player.presentFullscreenPlayer();
  };

  render() {
    const { source, ...otherProps } = this.props;

    return (
      <VideoWrapper>
        <PlayButton>
          <Icon name={'play'} size={50} />
        </PlayButton>
        <StyledVideo
          ref={this.setPlayerRef}
          source={source}
          aspectRatio={1}
          {...otherProps}
          paused
        />
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
