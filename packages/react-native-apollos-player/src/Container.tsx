import * as React from 'react';
import type { IPlayerMedia, IProgressProp, IProgressRef } from './types';
import FullscreenSlidingPlayer from './FullscreenSlidingPlayer';
import { NowPlayingContext, InternalPlayerContext } from './context';

import Controls from './Controls';
import NativeControls from './NativeControls';
import RNVideo from './RNVideo';

interface ContainerProps extends IPlayerMedia {
  autoplay?: Boolean;
  /** Component that renders the actual video. Default: react-native-video */
  VideoComponent?: React.FunctionComponent;
  /** Component that is displayed above the video */
  ControlsComponent?: React.FunctionComponent;
}

const Container: React.FunctionComponent<ContainerProps> = ({
  VideoComponent = RNVideo,
  ControlsComponent = Controls,
  children,
  source,
  coverImage,
  presentationProps,
  autoplay = false,
}) => {
  const [nowPlaying, setNowPlaying] = React.useState<IPlayerMedia | null>({
    source,
    coverImage,
    presentationProps,
  });
  const [isPlaying, setIsPlaying] = React.useState<boolean>(!!autoplay);
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);
  const [isInPiP, setIsInPiP] = React.useState<boolean>(false);
  const [playerId, setPlayerId] = React.useState<string>('');
  const [duration, setDuration] = React.useState<number>(0);
  const [seek, setSeekHandler] = React.useState<(seekTo: number) => void>(
    () => {}
  );
  const [skip, setSkipHandler] = React.useState<(skipBy: number) => void>(
    () => {}
  );
  const [
    isControlVisibilityLocked,
    setIsControlVisibilityLocked,
  ] = React.useState<boolean>(false);
  const [progressHandlers, setProgressHandlers] = React.useState<
    Array<(props: IProgressProp) => void>
  >([]);

  const reset = React.useCallback(() => {
    setNowPlaying(null);
    setIsPlaying(false);
    setIsFullscreen(false);
  }, [setNowPlaying, setIsPlaying, setIsFullscreen]);

  const playheadRef: IProgressRef = React.useRef<IProgressProp>({
    currentTime: 0,
    playableDuration: 0,
    seekableDuration: 0,
  });

  const addProgressHandler = React.useCallback(
    (handlerToAdd: (props: IProgressProp) => void) => {
      setProgressHandlers((prevState) => [...prevState, handlerToAdd]);
      return () =>
        setProgressHandlers((prevState) =>
          prevState.filter((handler) => handler === handlerToAdd)
        );
    },
    [setProgressHandlers]
  );
  const handleProgress = React.useCallback(
    (playhead: {
      currentTime: number;
      playableDuration: number;
      seekableDuration: number;
    }) => {
      console.log('handleProgress', { progressHandlers });
      progressHandlers.forEach((handler) => handler(playhead));
    },
    [progressHandlers]
  );

  const nowPlayingState = React.useMemo(
    () => ({
      addProgressHandler,
      nowPlaying,
      setNowPlaying,
      isPlaying,
      setIsPlaying,
      isFullscreen,
      setIsFullscreen,
      reset,
      seek,
      skip,
      isInPiP,
      setIsInPiP,
      duration,
    }),
    [
      addProgressHandler,
      nowPlaying,
      setNowPlaying,
      isPlaying,
      setIsPlaying,
      isFullscreen,
      setIsFullscreen,
      reset,
      seek,
      skip,
      isInPiP,
      setIsInPiP,
      duration,
    ]
  );

  const internalPlayerState = React.useMemo(
    () => ({
      handleProgress,
      playerId,
      setPlayerId,
      setSeekHandler,
      setSkipHandler,
      setIsControlVisibilityLocked,
      isControlVisibilityLocked,
      playheadRef,
      setDuration,
    }),
    [
      playerId,
      setPlayerId,
      setSeekHandler,
      setSkipHandler,
      setIsControlVisibilityLocked,
      isControlVisibilityLocked,
      handleProgress,
      playheadRef,
      setDuration,
    ]
  );

  return (
    <NowPlayingContext.Provider value={nowPlayingState}>
      <InternalPlayerContext.Provider value={internalPlayerState}>
        <NativeControls />
        <FullscreenSlidingPlayer
          VideoComponent={VideoComponent}
          ControlsComponent={ControlsComponent}
        >
          {children}
        </FullscreenSlidingPlayer>
      </InternalPlayerContext.Provider>
    </NowPlayingContext.Provider>
  );
};

export default Container;
