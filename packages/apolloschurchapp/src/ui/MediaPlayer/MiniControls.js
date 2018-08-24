import React, { Component } from 'react';
import gql from 'graphql-tag';
import { View, Animated, StyleSheet } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { Mutation, Query } from 'react-apollo';

import Touchable from '../Touchable';
import styled from '../styled';
import { H5, H6 } from '../typography';
import Icon from '../Icon';
import { withTheme } from '../theme';

import Seeker from './Seeker';

export const MINI_PLAYER_HEIGHT = 50;

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  animatedDismissContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
});

const TrackInfo = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit / 2,
  height: '100%',
  justifyContent: 'center',
  backgroundColor: theme.colors.lightPrimary,
  width: '100%',
}))(Touchable);

const TrackName = styled(({ theme }) => ({
  height: theme.sizing.baseUnit,
  overflow: 'hidden',
}))(H5);

const TrackArtist = styled(({ theme }) => ({
  height: theme.sizing.baseUnit,
  overflow: 'hidden',
}))(H6);

const Container = styled({
  overflow: 'hidden',
  height: MINI_PLAYER_HEIGHT,
  flexDirection: 'row',
  justifyContent: 'flex-start',
})(View);

const VideoSpacer = styled(({ isVideo }) => ({
  height: MINI_PLAYER_HEIGHT,
  aspectRatio: isVideo ? 16 / 9 : 1,
}))(View);

const Controls = styled(({ theme }) => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
  top: -1,
  paddingHorizontal: theme.sizing.baseUnit / 2,
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  backgroundColor: theme.colors.lightPrimary,
}))(Container);

const StyledSafeAreaView = styled(({ theme }) => ({
  backgroundColor: theme.colors.lightPrimary,
}))(SafeAreaView);

const MiniSeeker = styled({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
})(Seeker);

const StyledIcon = withTheme(({ theme }) => ({
  fill: theme.colors.darkTertiary,
}))(Icon);

const getControlState = gql`
  query {
    mediaPlayer @client {
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

const goFullscreenMutation = gql`
  mutation {
    mediaPlayerUpdateState(isFullscreen: true) @client
  }
`;

const playMutation = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: true) @client
  }
`;

const pauseMutation = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: false) @client
  }
`;

const dismissMutation = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: false, isVisible: false) @client
  }
`;

class MiniControls extends Component {
  dismissAnimator = new Animated.Value(0);

  shouldComponentUpdate() {
    return false;
  }

  renderMiniControls = ({
    data: {
      mediaPlayer: {
        currentTrack: { title, artist, isVideo } = {},
        isPlaying = false,
      } = {},
    } = {},
  }) => {
    Animated.spring(this.dismissAnimator, {
      toValue: isPlaying ? 0 : 1,
      overshootClamping: true,
      useNativeDriver: true,
    }).start();
    return [
      <Mutation key="mutation" mutation={goFullscreenMutation}>
        {(goFullscreen) => (
          <Container>
            <Mutation mutation={dismissMutation}>
              {(dismiss) => (
                <Touchable
                  onPress={() => (isPlaying ? goFullscreen() : dismiss())}
                >
                  <VideoSpacer isVideo={isVideo}>
                    <Animated.View
                      style={[
                        styles.animatedDismissContainer,
                        { opacity: this.dismissAnimator },
                      ]}
                    >
                      <StyledIcon name="close" />
                    </Animated.View>
                  </VideoSpacer>
                </Touchable>
              )}
            </Mutation>
            <TrackInfo onPress={() => goFullscreen()}>
              <TrackName>{title}</TrackName>
              <TrackArtist>{artist}</TrackArtist>
            </TrackInfo>
            <Controls>
              {isPlaying ? (
                <Mutation mutation={pauseMutation}>
                  {(pause) => (
                    <Touchable onPress={() => pause()}>
                      <StyledIcon name="pause" />
                    </Touchable>
                  )}
                </Mutation>
              ) : (
                <Mutation mutation={playMutation}>
                  {(play) => (
                    <Touchable onPress={() => play()}>
                      <StyledIcon name="play" />
                    </Touchable>
                  )}
                </Mutation>
              )}
            </Controls>
            <MiniSeeker minimal />
          </Container>
        )}
      </Mutation>,
      <StyledSafeAreaView
        key="safearea"
        forceInset={{ bottom: 'always', top: 'never' }}
      />,
    ];
  };

  render() {
    return <Query query={getControlState}>{this.renderMiniControls}</Query>;
  }
}

export default MiniControls;
