import * as React from 'react';
import { useContext } from 'react';

import {
  INowPlaying,
  IPlayerControls,
  PictureMode,
  IPlayhead,
  IInternalPlayer,
} from './types';

export const NowPlayingContext = React.createContext<INowPlaying>({
  source: undefined,
  coverImage: undefined,
  presentationProps: undefined,
  setNowPlaying: () => null,
});

export const useNowPlaying = () => useContext(NowPlayingContext);

export const PlayerControlsContext = React.createContext<IPlayerControls>({
  isPlaying: false,
  pictureMode: PictureMode.Normal,
  play: () => null,
  pause: () => null,
  seek: () => null,
  skip: () => null,
  setPictureMode: () => null,
  setIsControlVisibilityLocked: () => null,
  isControlVisibilityLocked: false,
});

export const usePlayerControls = () => useContext(PlayerControlsContext);

export const PlayheadContext = React.createContext<IPlayhead>({
  // Note: durations are initialized as 1 to help guard against a division by
  // zero issue - common to do elapsedTime / duration to get % progress
  totalDuration: 1,
  seekableDuration: 1,
  playableDuration: 1,
  elapsedTime: 0,
});

export const usePlayhead = () => useContext(PlayheadContext);

export const InternalPlayerContext = React.createContext<IInternalPlayer>({
  playerId: '',
  setPlayerId: () => null,
  setSeekHandler: () => null,
  setSkipHandler: () => null,
  updatePlayhead: () => null,
});

export const useInternalPlayer = () => useContext(InternalPlayerContext);
