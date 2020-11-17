import * as React from 'react';
import { StyleSheet, View, InteractionManager, Platform } from 'react-native';
import Video from 'react-native-video';
import { styled } from '@apollosproject/ui-kit';

import { useNowPlaying, usePlayerControls, useInternalPlayer } from './context';
import { PictureMode } from './types';

const Container = styled(
  ({ theme }: any) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black,
    overflow: 'hidden',
  }),
  'ApollosPlayer.RNVideoPresentation.Container'
)(View);

const RNVideoPresentation = () => {
  const nowPlaying = useNowPlaying();

  const { isPlaying, pictureMode, setPictureMode, pause } = usePlayerControls();

  const {
    setSkipHandler,
    setSeekHandler,
    updatePlayhead,
  } = useInternalPlayer();

  const durationRef = React.useRef(1);
  const elapsedTimeRef = React.useRef(0);

  const handleProgressProp = React.useCallback(
    (playhead: {
      currentTime: number;
      playableDuration: number;
      seekableDuration: number;
    }) => {
      const maxDuration = Math.max(
        durationRef.current,
        playhead.playableDuration,
        playhead.seekableDuration
      );

      durationRef.current = maxDuration;
      elapsedTimeRef.current = playhead.currentTime;

      updatePlayhead({
        totalDuration: maxDuration,
        seekableDuration: playhead.seekableDuration,
        playableDuration: playhead.playableDuration,
        elapsedTime: playhead.currentTime,
      });
    },
    [updatePlayhead, durationRef]
  );

  const handleLoad = ({ duration }: { duration: number }) => {
    durationRef.current = duration;
    updatePlayhead({
      totalDuration: duration,
      seekableDuration: 1,
      playableDuration: 1,
      elapsedTime: 0,
    });
  };

  const videoRef = React.useRef<Video>(null);

  const skip = React.useCallback(
    (skipBy: number) => {
      videoRef?.current?.seek(
        Math.max(
          0,
          Math.min(elapsedTimeRef.current + skipBy, durationRef.current)
        )
      );
    },
    [videoRef, elapsedTimeRef, durationRef]
  );

  React.useEffect(() => setSkipHandler(() => skip), [setSkipHandler, skip]);

  const seek = React.useCallback(
    (seekBy: number) => videoRef?.current?.seek(seekBy),
    [videoRef]
  );

  React.useEffect(() => setSeekHandler(() => seek), [setSeekHandler, seek]);

  // While Android doesn't have a fullscreen player, calling present
  // and dismiss does still hide the status bar and Android controls
  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (pictureMode === PictureMode.Fullscreen) {
      videoRef.current?.presentFullscreenPlayer();
    } else {
      videoRef.current?.dismissFullscreenPlayer();
    }
  }, [pictureMode]);

  return (
    <Container>
      {nowPlaying?.source ? (
        <Video
          ref={videoRef}
          source={nowPlaying?.source}
          paused={!isPlaying}
          ignoreSilentSwitch={'ignore'}
          allowsExternalPlayback
          // playInBackground kills PiP mode
          playInBackground={PictureMode.PictureInPicture !== pictureMode}
          playWhenInactive
          onProgress={handleProgressProp}
          onAudioBecomingNoisy={pause}
          pictureInPicture={pictureMode === PictureMode.PictureInPicture}
          onLoad={handleLoad}
          onEnd={pause}
          onPictureInPictureStatusChanged={({ isActive }) => {
            if (isActive) {
              // If the OS switches to PiP, make sure our state is updated:
              setPictureMode(PictureMode.PictureInPicture);
            } else if (pictureMode === PictureMode.PictureInPicture) {
              // Only switch back to Normal pictureMode if we're still in PiP
              setPictureMode(PictureMode.Normal);
            }
          }}
          onRestoreUserInterfaceForPictureInPictureStop={() => {
            setPictureMode(PictureMode.Fullscreen);
            InteractionManager.runAfterInteractions(() => {
              (videoRef.current as any).restoreUserInterfaceForPictureInPictureStopCompleted(
                true
              );
            });
          }}
          repeat
          resizeMode={
            PictureMode.Fullscreen === pictureMode ? 'contain' : 'cover'
          }
          style={StyleSheet.absoluteFill}
        />
      ) : null}
    </Container>
  );
};

export default RNVideoPresentation;
