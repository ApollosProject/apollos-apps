import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  BackHandler,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  View,
  Platform,
} from 'react-native';
import { Query, withApollo } from 'react-apollo';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';
import { get } from 'lodash';
import { compose } from 'recompose';

import {
  PaddedView,
  withTheme,
  withThemeMixin,
  styled,
  H4,
  H6,
  ButtonIcon,
} from '@apollosproject/ui-kit';

import { GET_CONTROL_STATE } from './queries';
import {
  PLAY,
  PAUSE,
  EXIT_FULLSCREEN,
  SHOW_VIDEO,
  HIDE_VIDEO,
  MUTE,
  UNMUTE,
} from './mutations';
import { ControlsConsumer } from './PlayheadState';
import Seeker from './Seeker';
import AirPlayButton from './AirPlayButton';

const Background = withTheme(({ theme }) => ({
  style: StyleSheet.absoluteFill,
  colors: [
    theme.colors.darkPrimary,
    theme.colors.transparent,
    theme.colors.darkPrimary,
  ],
  locations: [0, 0.4, 0.95],
}))(LinearGradient);

const UpperControls = styled({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})(View);

const LowerControls = styled({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})(PaddedView);

const PlayControls = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingBottom: theme.sizing.baseUnit * 1.5,
}))(PaddedView);

const PlayHead = styled({ paddingVertical: 0 })(PaddedView);

const Titles = styled({
  flex: 1,
  alignItems: 'center',
  paddingVertical: 0,
})(PaddedView);

const Title = styled({ textAlign: 'center' })(H4);
const Artist = styled({ textAlign: 'center' })(H6);

const IconSm = withTheme(({ theme }) => ({
  size: theme.sizing.baseUnit * 1.25,
  iconPadding: theme.sizing.baseUnit * 1.25,
}))(ButtonIcon);

const IconMd = withTheme(({ theme }) => ({
  size: theme.sizing.baseUnit * 1.875,
  iconPadding: theme.sizing.baseUnit * 0.9375,
}))(ButtonIcon);

const IconLg = withTheme(({ theme }) => ({
  size: theme.sizing.baseUnit * 3.125,
  iconPadding: theme.sizing.baseUnit * 0.3125,
}))(ButtonIcon);

/**
 * FullscreenControls displays fading player controls
 */
class FullscreenControls extends PureComponent {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func,
    }),
    showAudioToggleControl: PropTypes.bool,
    showVideoToggleControl: PropTypes.bool,
  };

  static defaultProps = {
    showAudioToggleControl: true,
    showVideoToggleControl: true,
  };

  state = {};

  fader = new Animated.Value(1);

  controlsVisible = true;

  wasFullscreen = false;

  open = Animated.spring(this.fader, {
    toValue: 1,
    useNativeDriver: true,
  });

  close = Animated.spring(this.fader, {
    toValue: 0,
    useNativeDriver: true,
  });

  constructor(...args) {
    super(...args);
    this.fader.addListener(({ value }) => {
      this.controlsVisible = value > 0.05;
    });
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.wasFullscreen) {
        this.handleClose();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
  }

  handleOnScrubbing = ({ isScrubbing }) => {
    this.setState({ isScrubbing });
  };

  handleClose = () => {
    this.props.client.mutate({ mutation: EXIT_FULLSCREEN });
  };

  handlePlay = () => {
    this.props.client.mutate({ mutation: PLAY });
  };

  handlePause = () => {
    this.props.client.mutate({ mutation: PAUSE });
  };

  handleShowVideo = () => {
    this.props.client.mutate({ mutation: SHOW_VIDEO });
  };

  handleHideVideo = () => {
    this.props.client.mutate({ mutation: HIDE_VIDEO });
  };

  handleMute = () => {
    this.props.client.mutate({ mutation: MUTE });
  };

  handleUnMute = () => {
    this.props.client.mutate({ mutation: UNMUTE });
  };

  handleControlVisibility = () => {
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    this.open.stop();
    this.close.stop();

    if (
      !this.state.isScrubbing &&
      this.isVideo &&
      this.isPlaying &&
      this.wasFullscreen &&
      (!this.animatingClosed && this.controlsVisible)
    ) {
      this.animatingClosed = true;
      this.close.start(() => {
        this.animatingClosed = false;
      });
    } else {
      this.open.start(() => {
        if (this.isVideo && this.isPlaying) this.queueClose();
      });
    }
  };

  queueClose = () => {
    this.closeTimeout = setTimeout(this.handleControlVisibility, 5000);
  };

  renderPlayerControls = ({ isLoading, skip }) => (
    <PlayControls>
      {this.props.showAudioToggleControl ? (
        <IconSm
          onPress={this.isMuted ? this.handleUnMute : this.handleMute}
          name={this.isMuted ? 'mute' : 'volume'}
          disabled={isLoading}
        />
      ) : (
        <IconSm name="empty" />
      )}
      <IconMd
        onPress={() => skip(-30)}
        name={'skip-back-thirty'}
        disabled={isLoading}
      />
      <IconLg
        onPress={this.isPlaying ? this.handlePause : this.handlePlay}
        name={this.isPlaying ? 'pause' : 'play'}
        disabled={isLoading}
      />
      <IconMd
        onPress={() => skip(30)}
        name={'skip-forward-thirty'}
        disabled={isLoading}
      />
      {this.props.showVideoToggleControl ? (
        <IconSm
          onPress={this.isVideo ? this.handleHideVideo : this.handleShowVideo}
          name={this.isVideo ? 'video' : 'video-off'}
          disabled={isLoading}
        />
      ) : (
        <IconSm name="empty" />
      )}
    </PlayControls>
  );

  renderFullscreenControls = ({ data: { mediaPlayer = {} } = {} }) => {
    this.isVideo = get(mediaPlayer, 'showVideo');
    this.isPlaying = mediaPlayer.isPlaying;
    this.isMuted = mediaPlayer.muted;

    if (
      (mediaPlayer.isFullscreen && !this.wasFullscreen) ||
      !this.isVideo ||
      (!this.isPlaying || (this.isPlaying && !this.wasPlaying))
    )
      this.handleControlVisibility();

    this.wasFullscreen = mediaPlayer.isFullscreen;
    this.wasPlaying = mediaPlayer.isPlaying;

    return (
      <TouchableWithoutFeedback onPress={this.handleControlVisibility}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: this.fader }]}
        >
          <Background>
            <SafeAreaView
              style={StyleSheet.absoluteFill}
              forceInset={{ top: 'always', bottom: 'always' }}
            >
              <UpperControls>
                <IconSm name="arrow-down" onPress={this.handleClose} />
                <Titles>
                  <Title>{get(mediaPlayer, 'currentTrack.title')}</Title>
                  <Artist>{get(mediaPlayer, 'currentTrack.artist')}</Artist>
                </Titles>
                {Platform.OS === 'ios' ? (
                  <AirPlayButton />
                ) : (
                  <IconSm name="empty" disabled />
                )}
              </UpperControls>
              <LowerControls horizontal={false}>
                <PlayHead>
                  <Seeker onScrubbing={this.handleOnScrubbing} />
                </PlayHead>
                <ControlsConsumer>{this.renderPlayerControls}</ControlsConsumer>
              </LowerControls>
            </SafeAreaView>
          </Background>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <Query query={GET_CONTROL_STATE}>{this.renderFullscreenControls}</Query>
    );
  }
}

export default compose(
  withApollo,
  withThemeMixin({ type: 'dark' })
)(FullscreenControls);
