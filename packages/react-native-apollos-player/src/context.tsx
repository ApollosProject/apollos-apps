import * as React from 'react';

import type { INowPlaying, IInternalPlayer, IProgressProp } from './types';

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
  addProgressHandler: (_: (props: IProgressProp) => void) => () => {},
});

export const InternalPlayerContext = React.createContext<IInternalPlayer>({
  setPlayerId: () => null,
  setSeekHandler: () => null,
  setSkipHandler: () => null,
  setIsControlVisibilityLocked: () => null,
  isControlVisibilityLocked: true,
  playerId: '',
  handleProgress: () => {},
  playheadRef: {
    current: { currentTime: 0, playableDuration: 1, seekableDuration: 1 },
  },
});
