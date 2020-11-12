import * as React from 'react';

import type {
  IPresentationComponents,
  INowPlaying,
  IInternalPlayer,
  IProgressProp,
} from './types';
import MiniPresentation from './presentations/MiniPresentation';
import RNVideoPresentation from './presentations/RNVideoPresentation';

export const NowPlayingContext = React.createContext<INowPlaying>({
  nowPlaying: null,
  isPlaying: false,
  isFullscreen: false,
  setNowPlaying: () => null,
  setIsPlaying: () => null,
  setIsFullscreen: () => null,
  reset: () => null,
  seek: () => null,
  skip: () => null,
  isInPiP: false,
  setIsInPiP: () => null,
});

export const PresentationContext = React.createContext<IPresentationComponents>(
  {
    VideoComponent: RNVideoPresentation,
    PresentationComponent: MiniPresentation,
  }
);

export const InternalPlayerContext = React.createContext<IInternalPlayer>({
  setPlayerId: () => null,
  setSeekHandler: () => null,
  setSkipHandler: () => null,
  setIsControlVisibilityLocked: () => null,
  isControlVisibilityLocked: true,
  playerId: '',
  onProgress: (_: (props: IProgressProp) => void) => () => {},
  handleProgress: () => {},
  playheadRef: {
    current: { currentTime: 0, playableDuration: 1, seekableDuration: 1 },
  },
});
