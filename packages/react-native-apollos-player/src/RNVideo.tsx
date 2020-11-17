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

  const playheadRef = React.useRef({
    totalDuration: 1,
    seekableDuration: 1,
    playableDuration: 1,
    elapsedTime: 0,
  });

  const handleProgressProp = React.useCallback(
    (playhead: {
      currentTime: number;
      playableDuration: number;
      seekableDuration: number;
    }) => {
      const totalDuration = Math.max(
        playheadRef.current.totalDuration,
        playhead.playableDuration,
        playhead.seekableDuration
      );

      const newPlayhead = {
        totalDuration,
        seekableDuration: playhead.seekableDuration,
        playableDuration: playhead.playableDuration,
        elapsedTime: playhead.currentTime,
      };

      playheadRef.current = newPlayhead;
      updatePlayhead(newPlayhead);
    },
    [updatePlayhead, playheadRef]
  );

  const handleLoad = ({ duration }: { duration: number }) => {
    playheadRef.current = { ...playheadRef.current, totalDuration: duration };
    updatePlayhead(playheadRef.current);
  };

  const videoRef = React.useRef<Video>(null);

  const skip = React.useCallback(
    (skipBy: number) => {
      videoRef?.current?.seek(
        Math.max(
          0,
          Math.min(
            playheadRef.current.elapsedTime + skipBy,
            playheadRef.current.totalDuration
          )
        )
      );
    },
    [videoRef, playheadRef]
  );

  React.useEffect(() => setSkipHandler(() => skip), [setSkipHandler, skip]);

  const seek = React.useCallback(
    (seekTo: number) => {
      videoRef?.current?.seek(seekTo);
      updatePlayhead({
        ...playheadRef.current,
        elapsedTime: seekTo,
      });
    },
    [videoRef, playheadRef, updatePlayhead]
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
