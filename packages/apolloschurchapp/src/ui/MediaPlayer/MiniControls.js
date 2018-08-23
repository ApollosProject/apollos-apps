import React, { Component } from 'react';
import gql from 'graphql-tag';
import { View, Animated, StyleSheet } from 'react-native';
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

const VideoSpacer = styled({
  height: MINI_PLAYER_HEIGHT,
  aspectRatio: 16 / 9,
})(View);

const Controls = styled(({ theme }) => ({
  position: 'absolute',
  right: 0,
  bottom: 0,
  top: -1,
  paddingHorizontal: theme.sizing.baseUnit / 2,
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
}))(Container);

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
        currentTrack: { title, artist } = {},
        isPlaying = false,
      } = {},
    } = {},
  }) => {
    Animated.spring(this.dismissAnimator, {
      toValue: isPlaying ? 0 : 1,
      overshootClamping: true,
      useNativeDriver: true,
    }).start();
    return (
      <Mutation mutation={goFullscreenMutation}>
        {(goFullscreen) => (
          <Container>
            <Mutation mutation={dismissMutation}>
              {(dismiss) => (
                <Touchable
                  onPress={() => (isPlaying ? goFullscreen() : dismiss())}
                >
                  <VideoSpacer>
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
            <Touchable onPress={() => goFullscreen()}>
              <TrackInfo>
                <TrackName>{title}</TrackName>
                <TrackArtist>{artist}</TrackArtist>
              </TrackInfo>
            </Touchable>
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
      </Mutation>
    );
  };

  render() {
    return <Query query={getControlState}>{this.renderMiniControls}</Query>;
  }
}

export default MiniControls;
