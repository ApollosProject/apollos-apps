import * as React from 'react';
import {
  StyleSheet,
  View,
  InteractionManager,
  Platform,
  Animated,
} from 'react-native';
import Video from 'react-native-video';
import { styled, ActivityIndicator } from '@apollosproject/ui-kit';

import { useNowPlaying, usePlayerControls, useInternalPlayer } from './context';
import { PictureMode } from './types';

import CoverImage from './CoverImage';

const Container = styled(
  ({ theme }: any) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black,
    overflow: 'hidden',
  }),
  'ApollosPlayer.RNVideoPresentation.Container'
)(View);

interface VideoExpanded extends Video {
  setNativeProps: (arg0: any) => void;
}

const RNVideoPresentation = ({
  useNativeFullscreeniOS,
  onEnd,
}: {
  useNativeFullscreeniOS?: boolean;
  onEnd: Function;
}) => {
  const nowPlaying = useNowPlaying();
  const { isPlaying, pictureMode, setPictureMode, pause } = usePlayerControls();

  const [showCoverImage, setShowCoverImage] = React.useState(true);
  const coverImageOpacity = React.useRef(new Animated.Value(1)).current;
  Animated.spring(coverImageOpacity, {
    toValue: showCoverImage || nowPlaying.audioOnly ? 1 : 0,
    useNativeDriver: true,
  }).start();

  const [showLoading, setShowLoading] = React.useState(true);
  const loadingOpacity = React.useRef(new Animated.Value(1)).current;
  Animated.spring(loadingOpacity, {
    toValue: showLoading ? 1 : 0,
    useNativeDriver: true,
  }).start();

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
      // the default currentTime is often a very low value
      // ex: 0.000009999999747378752
      if (playhead.currentTime >= 0.01 && showCoverImage)
        setShowCoverImage(false);
      updatePlayhead(newPlayhead);
    },
    [updatePlayhead, playheadRef, setShowCoverImage, showCoverImage]
  );

  const handleLoad = ({ duration }: { duration: number }) => {
    setShowLoading(false);
    playheadRef.current = { ...playheadRef.current, totalDuration: duration };
    updatePlayhead(playheadRef.current);
  };

  const videoRef = React.useRef<VideoExpanded>(null);

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
    if (Platform.OS === 'android' || useNativeFullscreeniOS) {
      if (pictureMode === PictureMode.Fullscreen) {
        videoRef.current?.presentFullscreenPlayer();
      } else {
        videoRef.current?.dismissFullscreenPlayer();
      }
    }
  }, [pictureMode, useNativeFullscreeniOS, pause]);

  React.useLayoutEffect(() => {
    return () => {
      // Ugly :/
      // Thanks to RNScreens, the native video doesn't realize it's unmounted.
      // React land does though, so we need to intercept that unmount and stop the video.
      // We also need to stop pip, since the PIP player doesn't work once the component is paused.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      videoRef?.current?.setNativeProps({
        paused: true,
        pictureInPicture: false,
      });
    };
  }, []);

  const handleVideoEnded = () => {
    onEnd();
    pause();
  };

  return (
    <Container>
      {nowPlaying?.source ? (
        <Video
          // this forces a remount when the source changes...helps prevent bugs
          key={(nowPlaying?.source || '').toString()}
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
          onLoadStart={() => {
            setShowLoading(true);
            setShowCoverImage(true);
          }}
          onEnd={handleVideoEnded}
          onFullscreenPlayerWillDismiss={() => {
            setPictureMode(PictureMode.Normal);
            if (Platform.OS === 'ios') pause();
          }}
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
            setPictureMode(PictureMode.Normal);
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
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: coverImageOpacity }]}
      >
        <CoverImage source={nowPlaying?.coverImage} />
      </Animated.View>
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: loadingOpacity }]}
      >
        <ActivityIndicator size="large" />
      </Animated.View>
    </Container>
  );
};

export default RNVideoPresentation;
