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

import NativeControls from './NativeControls';

import useSourceComponents from './useSourceComponents';

interface ContainerProps extends IPlayerMedia, FullScreenSlidingPlayerProps {
  autoplay?: Boolean;
  onPlay?: Function;
  onPause?: Function;
  onEnd?: Function;

  /** The Player Component. Defaults to FullscreenSlidingPlayer */
  PlayerComponent?: React.FunctionComponent;
}

const usePrevious = (value: any) => {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const Container: React.FunctionComponent<ContainerProps> = ({
  VideoComponent,
  ControlsComponent,
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
  videos,
  onPlay = () => {},
  onPause = () => {},
  onEnd = () => {},
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
  const prevIsPlaying = usePrevious(isPlaying);
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
  // Detect the correct VideoComponent and ControlsComponent to use
  const sourceComponents = useSourceComponents({
    source: nowPlaying.source,
    VideoComponent,
    ControlsComponent,
  });

  // we need a session id for some analytics events. The session ID should be
  // created on mount, and different for each video player
  const { current: sessionId } = React.useRef<string>(Date.now().toString());
  const analyticsMeta = { sessionId };

  // ---------
  // setup onEnd effect on unmount
  React.useEffect(
    () => {
      const { elapsedTime, totalDuration } = playhead;
      if (autoplay) {
        onPlay({ elapsedTime, totalDuration, ...analyticsMeta });
      }
      return () => {
        return onEnd({ elapsedTime, totalDuration, ...analyticsMeta });
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  React.useEffect(() => {
    const { elapsedTime, totalDuration } = playhead;
    if (prevIsPlaying && !isPlaying) {
      onPause({ elapsedTime, totalDuration, ...analyticsMeta });
    } else if (!prevIsPlaying && isPlaying) {
      onPlay({ elapsedTime, totalDuration, ...analyticsMeta });
    }
  }, [isPlaying, prevIsPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

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
                    {...sourceComponents}
                    collapseOnScroll={collapseOnScroll}
                    useNativeFullscreeniOS={useNativeFullscreeniOS}
                    scrollViewRef={scrollViewRef}
                    videos={videos}
                    onEnd={onEnd}
                  >
                    {children}
                  </PlayerComponent>
                </React.Fragment>
              ),
              [
                children,
                sourceComponents,
                collapseOnScroll,
                useNativeFullscreeniOS,
                scrollViewRef,
                videos,
                onEnd,
              ]
            )}
          </PlayheadContext.Provider>
        </NowPlayingContext.Provider>
      </PlayerControlsContext.Provider>
    </InternalPlayerContext.Provider>
  );
};

export default Container;
