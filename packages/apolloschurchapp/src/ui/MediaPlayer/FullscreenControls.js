import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {
  BackHandler,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Query, withApollo } from 'react-apollo';
import LinearGradient from 'react-native-linear-gradient';
import SafeAreaView from 'react-native-safe-area-view';
import { get } from 'lodash';
import { compose } from 'recompose';

import PaddedView from '../PaddedView';
import { withTheme, withThemeMixin } from '../theme';
import styled from '../styled';
import { H4, H6 } from '../typography';
import Icon from '../Icon';
import Touchable from '../Touchable';

import Seeker from './Seeker';

const Background = withTheme(({ theme }) => ({
  style: StyleSheet.absoluteFill,
  colors: [
    theme.colors.darkPrimary,
    theme.colors.transparent,
    theme.colors.darkPrimary,
  ],
  locations: [0, 0.4, 0.95],
}))(LinearGradient);

const UpperControl = styled({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})(PaddedView);

const LowerControl = styled({
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
  alignItems: 'center',
  paddingVertical: 0,
})(PaddedView);

const Title = styled({ textAlign: 'center' })(H4);
const Artist = styled({ textAlign: 'center' })(H6);

const IconSm = withTheme(({ theme, disabled }) => ({
  size: theme.sizing.baseUnit,
  opacity: disabled ? 0.5 : 1,
}))(Icon);

const IconMd = withTheme(({ theme, disabled }) => ({
  size: theme.sizing.baseUnit * 1.5,
  opacity: disabled ? 0.5 : 1,
}))(Icon);

const IconLg = withTheme(({ theme, disabled }) => ({
  size: theme.sizing.baseUnit * 2.5,
  opacity: disabled ? 0.5 : 1,
}))(Icon);

const getControlState = gql`
  query {
    mediaPlayer @client {
      isFullscreen
      isPlaying
      currentTrack {
        id
        title
        artist
        isVideo
      }
    }
  }
`;

const exitFullscreen = gql`
  mutation {
    mediaPlayerUpdateState(isFullscreen: false) @client
  }
`;

const pause = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: false) @client
  }
`;

const play = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: true) @client
  }
`;

class FullscreenControls extends PureComponent {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func,
    }),
  };

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

  handleClose = () => {
    this.props.client.mutate({ mutation: exitFullscreen });
  };

  handlePlay = () => {
    this.props.client.mutate({ mutation: play });
  };

  handlePause = () => {
    this.props.client.mutate({ mutation: pause });
  };

  handleControlVisibility = () => {
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    this.open.stop();
    this.close.stop();

    if (
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

  renderFullscreenControls = ({ data: { mediaPlayer = {} } = {} }) => {
    this.isVideo = get(mediaPlayer, 'currentTrack.isVideo');
    this.isPlaying = mediaPlayer.isPlaying;

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
              <Touchable onPress={this.handleClose}>
                <UpperControl>
                  <IconSm name="arrow-down" />
                  <Titles>
                    <Title>{get(mediaPlayer, 'currentTrack.title')}</Title>
                    <Artist>{get(mediaPlayer, 'currentTrack.artist')}</Artist>
                  </Titles>
                  <IconSm name="empty" />
                </UpperControl>
              </Touchable>
              <LowerControl>
                <PlayHead>
                  <Seeker />
                </PlayHead>
                <PlayControls>
                  <IconSm disabled name="shuffle" />
                  <IconMd disabled name="skip-previous" />
                  {mediaPlayer.isPlaying ? (
                    <Touchable onPress={this.handlePause}>
                      <IconLg name="pause" />
                    </Touchable>
                  ) : (
                    <Touchable onPress={this.handlePlay}>
                      <IconLg name="play" />
                    </Touchable>
                  )}
                  <IconMd disabled name="skip-next" />
                  <IconSm disabled name="repeat" />
                </PlayControls>
              </LowerControl>
            </SafeAreaView>
          </Background>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <Query query={getControlState}>{this.renderFullscreenControls}</Query>
    );
  }
}

export default compose(withApollo, withThemeMixin({ type: 'dark' }))(
  FullscreenControls
);
