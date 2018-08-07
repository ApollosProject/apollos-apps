import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Video from 'react-native-video';

import styled from '/mobile/ui/styled';
import Touchable from '/mobile/ui/Touchable';
import { withTheme } from '/mobile/ui/theme';
import Icon from '/mobile/ui/Icon';

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

  setPlayerRef = (element) => {
    this.player = element;
  };

  handleOnPress = () => {
    this.player.presentFullscreenPlayer();
  };

  handleOnFullscreenPlayerDidPresent = () => this.setState({ paused: false });

  handleOnFullscreenPlayerDidDismiss = () => this.setState({ paused: true });

  render() {
    const { source, ...otherProps } = this.props;

    return (
      <VideoWrapper>
        <PlayButton onPress={this.handleOnPress}>
          <AndroidPositioningFix>
            <StyledIcon />
          </AndroidPositioningFix>
        </PlayButton>
        <Video
          ref={this.setPlayerRef}
          source={source}
          onFullscreenPlayerDidPresent={this.handleOnFullscreenPlayerDidPresent}
          onFullscreenPlayerDidDismiss={this.handleOnFullscreenPlayerDidDismiss}
          // TODO: remove when styled supports passing refs
          style={{ width: '100%' }} // eslint-disable-line react-native/no-inline-styles
          aspectRatio={16 / 9}
          paused={this.state.paused}
          {...otherProps}
        />
      </VideoWrapper>
    );
  }
}

export default VideoPlayer;
