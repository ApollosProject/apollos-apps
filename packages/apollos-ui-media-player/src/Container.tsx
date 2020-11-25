import * as React from 'react';
import {
  IPlayerMedia,
  PictureMode,
  INowPlaying,
  IPlayhead,
  IPlayerControls,
  IInternalPlayer,
} from './types';
import FullscreenSlidingPlayer, {
  FullScreenSlidingPlayerProps,
} from './FullscreenSlidingPlayer';
import {
  NowPlayingContext,
  PlayerControlsContext,
  PlayheadContext,
  InternalPlayerContext,
} from './context';

import Controls from './Controls';
import NativeControls from './NativeControls';
import RNVideo from './RNVideo';

interface ContainerProps extends IPlayerMedia, FullScreenSlidingPlayerProps {
  autoplay?: Boolean;

  /** The Player Component. Defaults to FullscreenSlidingPlayer */
  PlayerComponent?: React.FunctionComponent;
}

const Container: React.FunctionComponent<ContainerProps> = ({
  VideoComponent = RNVideo,
  ControlsComponent = Controls,
  PlayerComponent = FullscreenSlidingPlayer,
  children,
  source,
  coverImage,
  presentationProps,
  collapseOnScroll,
  isLive = false,
  audioOnly = false,
  autoplay = false,
  useNativeFullscreeniOS,
  scrollViewRef,
}) => {
  /*
    We're going to set up 4 context state objects in this component:
    1. nowPlayingContext: INowPlaying
    2. playerControlsContext: IPlayerControls
    3. playheadContext: IPlayheadContext
    4. internalPlayerContext: IInternalPlayer

    Read about these context shapes in ./types.tsx
  */

  // ---------
  // setup NowPlaying Context
  const [nowPlaying, setNowPlaying] = React.useState<IPlayerMedia>({
    source,
    coverImage,
    isLive,
    audioOnly,
    presentationProps,
  });

  const nowPlayingContext: INowPlaying = React.useMemo(
    () => ({
      ...nowPlaying,
      setNowPlaying,
    }),
    [nowPlaying, setNowPlaying]
  );

  // ---------
  // setup PlayerControls Context
  const [isPlaying, setIsPlaying] = React.useState<boolean>(!!autoplay);
  const [seek, setSeekHandler] = React.useState<IPlayerControls['seek']>(
    () => {}
  );
  const [skip, setSkipHandler] = React.useState<IPlayerControls['skip']>(
    () => {}
  );
  const play = React.useCallback(() => setIsPlaying(true), [setIsPlaying]);
  const pause = React.useCallback(() => setIsPlaying(false), [setIsPlaying]);
  const [pictureMode, setPictureMode] = React.useState<PictureMode>(
    PictureMode.Normal
  );
  const [
    isControlVisibilityLocked,
    setIsControlVisibilityLocked,
  ] = React.useState<boolean>(false);

  const playerControlsContext: IPlayerControls = React.useMemo(
    () => ({
      isPlaying,
      seek,
      skip,
      play,
      pause,
      pictureMode,
      setPictureMode,
      isControlVisibilityLocked,
      setIsControlVisibilityLocked,
    }),
    [
      isPlaying,
      seek,
      skip,
      play,
      pause,
      pictureMode,
      setPictureMode,
      isControlVisibilityLocked,
      setIsControlVisibilityLocked,
    ]
  );

  // ---------
  // Setup Playhead Context
  const [playhead, updatePlayhead] = React.useState<IPlayhead>({
    totalDuration: 1,
    seekableDuration: 1,
    playableDuration: 1,
    elapsedTime: 0,
  });

  // Vincent not using useMemo here is for you 😘
  const playheadContext: IPlayhead = playhead;

  // ---------
  // Setup InternalPlayer Context
  const [playerId, setPlayerId] = React.useState<string>('');

  const internalPlayerContext: IInternalPlayer = React.useMemo(
    () => ({
      playerId,
      setPlayerId,
      setSeekHandler,
      setSkipHandler,
      updatePlayhead,
    }),
    [playerId, setPlayerId, setSeekHandler, setSkipHandler, updatePlayhead]
  );

  // ---------
  // 🚀 Go Time
  return (
    <InternalPlayerContext.Provider value={internalPlayerContext}>
      <PlayerControlsContext.Provider value={playerControlsContext}>
        <NowPlayingContext.Provider value={nowPlayingContext}>
          <PlayheadContext.Provider value={playheadContext}>
            {React.useMemo(
              () => (
                <React.Fragment>
                  <NativeControls />
                  <PlayerComponent
                    VideoComponent={VideoComponent}
                    ControlsComponent={ControlsComponent}
                    collapseOnScroll={collapseOnScroll}
                    useNativeFullscreeniOS={useNativeFullscreeniOS}
                    scrollViewRef={scrollViewRef}
                  >
                    {children}
                  </PlayerComponent>
                </React.Fragment>
              ),
              [
                children,
                VideoComponent,
                ControlsComponent,
                collapseOnScroll,
                useNativeFullscreeniOS,
                scrollViewRef,
              ]
            )}
          </PlayheadContext.Provider>
        </NowPlayingContext.Provider>
      </PlayerControlsContext.Provider>
    </InternalPlayerContext.Provider>
  );
};

export default Container;
