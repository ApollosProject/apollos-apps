import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import { Mutation, Query } from 'react-apollo';

import styled from 'apolloschurchapp/src/ui/styled';
import Touchable from 'apolloschurchapp/src/ui/Touchable';
import { H5, H6 } from 'apolloschurchapp/src/ui/typography';
import Icon from 'apolloschurchapp/src/ui/Icon';
import { withTheme } from 'apolloschurchapp/src/ui/theme';

import Seeker from './Seeker';

import { getControlState } from './queries';

import {
  goFullscreen as goFullscreenMutation,
  dismiss as dismissMutation,
  play as playMutation,
  pause as pauseMutation,
} from './mutations';

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

const TrackInfoTouchable = styled(({ theme }) => ({
  backgroundColor: theme.colors.lightPrimary,
  width: '100%',
  height: '100%',
}))(Touchable);

const TrackInfo = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit / 2,
  height: '100%',
  justifyContent: 'center',
  width: '100%',
}))(View);

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
            <TrackInfoTouchable onPress={() => goFullscreen()}>
              <TrackInfo>
                <TrackName>{title}</TrackName>
                <TrackArtist>{artist}</TrackArtist>
              </TrackInfo>
            </TrackInfoTouchable>
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
