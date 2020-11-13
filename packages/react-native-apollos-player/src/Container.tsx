import * as React from 'react';
import type {
  IPlayerMedia,
  IPresentationComponents,
  IProgressProp,
  IProgressRef,
} from './types';
import FullscreenSlidingPlayer from './FullscreenSlidingPlayer';
import {
  NowPlayingContext,
  PresentationContext,
  InternalPlayerContext,
} from './context';

import FullscreenPresentation from './presentations/FullscreenPresentation';
import RNVideoPresentation from './presentations/RNVideoPresentation';

interface ContainerProps extends IPresentationComponents, IPlayerMedia {
  autoplay?: Boolean;
}

const Container: React.FunctionComponent<ContainerProps> = ({
  VideoComponent = RNVideoPresentation,
  PresentationComponent = FullscreenPresentation,
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
    },
    [setNowPlaying, setIsPlaying, setIsFullscreen]
  );

  const playheadRef = React.useRef<IProgressRef>({
    currentTime: 0,
    playableDuration: 0,
    seekableDuration: 0,
  });

  const nowPlayingState = React.useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  const onProgress = React.useCallback(
    (handlerToAdd: (props: IProgressProp) => void) => {
      setProgressHandlers((prevState) => [...prevState, handlerToAdd]);
      return () =>
        setProgressHandlers((prevState) =>
          prevState.filter((handler) => handler === handlerToAdd)
        );
    },
    [setProgressHandlers]
  );

  const handleProgress = React.useMemo(
    () => (playhead: {
      currentTime: number;
      playableDuration: number;
      seekableDuration: number;
    }) => {
      progressHandlers.forEach((handler) => handler(playhead));
    },
    [progressHandlers]
  );

  const internalPlayerState = React.useMemo(
    () => ({
      onProgress,
      handleProgress,
      playerId,
      setPlayerId,
      setSeekHandler,
      setSkipHandler,
      setIsControlVisibilityLocked,
      isControlVisibilityLocked,
      playheadRef,
    }),
    [
      playerId,
      setPlayerId,
      setSeekHandler,
      setSkipHandler,
      setIsControlVisibilityLocked,
      isControlVisibilityLocked,
      handleProgress,
      onProgress,
      playheadRef,
    ]
  );

  const presentationState = React.useMemo(
    () => ({
      VideoComponent,
      PresentationComponent,
    }),
    [VideoComponent, PresentationComponent]
  );

  return (
    <NowPlayingContext.Provider value={nowPlayingState}>
      <PresentationContext.Provider value={presentationState}>
        <InternalPlayerContext.Provider value={internalPlayerState}>
          <FullscreenSlidingPlayer>{children}</FullscreenSlidingPlayer>
        </InternalPlayerContext.Provider>
      </PresentationContext.Provider>
    </NowPlayingContext.Provider>
  );
};

export default Container;
