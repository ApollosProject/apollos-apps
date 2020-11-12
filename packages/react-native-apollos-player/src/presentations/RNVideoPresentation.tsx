import * as React from 'react';
import { StyleSheet, View, InteractionManager, Platform } from 'react-native';
import Video from 'react-native-video';
import { styled } from '@apollosproject/ui-kit';
import usePlayer from '../usePlayer';

import { InternalPlayerContext } from '../context';

const Container = styled(
  ({ theme }: any) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black,
    overflow: 'hidden',
  }),
  'ApollosPlayer.RNVideoPresentation.Container'
)(View);

const RNVideoPresentation = () => {
  const {
    nowPlaying,
    setIsFullscreen,
    isFullscreen,
    isPlaying,
    setIsPlaying,
    setIsInPiP,
    isInPiP,
  } = usePlayer();

  const {
    setSkipHandler,
    setSeekHandler,
    handleProgress,
    playheadRef,
  } = React.useContext(InternalPlayerContext);

  const handleProgressProp = React.useMemo(
    () => (playhead: {
      currentTime: number;
      playableDuration: number;
      seekableDuration: number;
    }) => {
      playheadRef.current = playhead;
      handleProgress(playhead);
    },
    [playheadRef, handleProgress]
  );

  const videoRef = React.useRef<Video>(null);

  const skip = React.useMemo(
    () => (skipBy: number) => {
      videoRef?.current?.seek(
        Math.max(
          0,
          Math.min(
            playheadRef.current.currentTime + skipBy,
            playheadRef.current.seekableDuration
          )
        )
      );
    },
    [videoRef, playheadRef]
  );

  React.useEffect(() => setSkipHandler(() => skip), [setSkipHandler, skip]);

  const seek = React.useMemo(
    () => (seekBy: number) => videoRef?.current?.seek(seekBy),
    [videoRef]
  );

  React.useEffect(() => setSeekHandler(() => seek), [setSeekHandler, seek]);

  // While Android doesn't have a fullscreen player, calling present
  // and dismiss does still hide the status bar and Android controls
  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (isFullscreen) {
      videoRef.current?.presentFullscreenPlayer();
    } else {
      videoRef.current?.dismissFullscreenPlayer();
    }
  }, [isFullscreen]);

  return (
    <Container>
      {nowPlaying?.source ? (
        <Video
          ref={videoRef}
          source={nowPlaying?.source}
          paused={!isPlaying}
          ignoreSilentSwitch={'ignore'}
          allowsExternalPlayback
          // playInBackground
          playWhenInactive
          onProgress={handleProgressProp}
          onAudioBecomingNoisy={() => setIsPlaying(false)}
          pictureInPicture={isInPiP}
          onEnd={() => {
            setIsPlaying(false);
          }}
          onPictureInPictureStatusChanged={({ isActive }) =>
            setIsInPiP(isActive)
          }
          onRestoreUserInterfaceForPictureInPictureStop={() => {
            setIsFullscreen(true);
            InteractionManager.runAfterInteractions(() => {
              (videoRef.current as any).restoreUserInterfaceForPictureInPictureStopCompleted(
                true
              );
            });
          }}
          repeat
          resizeMode={isFullscreen ? 'contain' : 'cover'}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
    </Container>
  );
};

export default RNVideoPresentation;
