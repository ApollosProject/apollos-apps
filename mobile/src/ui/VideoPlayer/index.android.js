import React, { PureComponent } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { default as Video } from 'react-native-video-controls'; // eslint-disable-line import/no-named-default

import styled from '/mobile/ui/styled';
import Touchable from '/mobile/ui/Touchable';
import { withTheme } from '/mobile/ui/theme';
import Icon from '/mobile/ui/Icon';
import ProgressiveImage from '/mobile/ui/ProgressiveImage';

const VideoWrapper = styled({
  position: 'relative',
})(View);

const PlayButton = styled({
  ...StyleSheet.absoluteFillObject,
  zIndex: 2,
})(Touchable);

const AndroidPositioningFix = styled({
  ...StyleSheet.absoluteFillObject,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
})(View);

const StyledIcon = compose(
  withTheme(({ theme: { colors: { lightPrimary } = {} } = {} }) => ({
    name: 'play',
    size: 50,
    fill: lightPrimary,
  }))
)(Icon);

// const StyledVideo = styled({
//   width: '100%',
// })(Video);

class VideoPlayer extends PureComponent {
  static propTypes = {
    source: PropTypes.shape({}),
    isLoading: PropTypes.bool,
  };

  constructor() {
    super();

    this.state = { paused: true };
  }

  handleOnPress = () => {
    this.setState({ paused: false });
  };

  handleOnRequestClose = () => this.setState({ paused: true });

  render() {
    const { source, ...otherProps } = this.props;
    return (
      <VideoWrapper>
        <PlayButton onPress={this.handleOnPress}>
          <AndroidPositioningFix>
            <StyledIcon />
          </AndroidPositioningFix>
        </PlayButton>
        <ProgressiveImage
          source={'https://picsum.photos/600/400/'}
          style={{ aspectRatio: 16 / 9 }}
        />
        <Modal
          visible={!this.state.paused}
          onRequestClose={this.handleOnRequestClose}
          animationType={'fade'}
        >
          <Video
            source={source}
            onBack={this.handleOnRequestClose}
            disableFullscreen
            {...otherProps}
          />
        </Modal>
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
