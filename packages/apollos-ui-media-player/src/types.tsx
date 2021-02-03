export interface IPlayerMedia {
  /** Media Source to play. Passed unaltered to underyling Video component */
  source?: { uri?: string };
  /** Image to display while loading */
  coverImage?: { uri?: string } | [{ uri: string }];
  /** Disables irrelevant UI controls during live stream */
  isLive?: boolean;
  /** Keeps the cover image visible at all times and disables the video track */
  audioOnly?: boolean;

  /** props intended to be used by Presentation Components */
  presentationProps?:
    | any // so you can roll your own presentation components!
    | {
        /** Title to display above video */
        title?: string;
        /** Description to display above video */
        description?: string;
        /** "Badge" to render in the corner of the video. Ex: live badge */
        badge?: JSX.Element;
      };
}

export enum PictureMode {
  Normal,
  Fullscreen,
  PictureInPicture,
  Collapsed,
}

// Used in the useNowPlaying() hook
export interface INowPlaying extends IPlayerMedia {
  setNowPlaying: React.Dispatch<React.SetStateAction<IPlayerMedia>>;
}

// Used in the usePlayerControls() hook
export interface IPlayerControls {
  isPlaying: boolean;
  pictureMode: PictureMode;

  /** Seek to number of seconds */
  seek: (seekTo: number) => void;
  /** Skip by number of seconds */
  skip: (skipBy: number) => void;

  play: () => void;
  pause: () => void;

  setPictureMode: React.Dispatch<React.SetStateAction<PictureMode>>;

  // Locks the visibility of the playhead controls. This is notably toggled
  // to true when a user is actively dragging the seeker - so that the controls
  // don't fade out while the user is dragging.
  setIsControlVisibilityLocked: React.Dispatch<React.SetStateAction<boolean>>;
  isControlVisibilityLocked: boolean;
}

// Used in the usePlayhead() hook
export interface IPlayhead {
  totalDuration: number;
  seekableDuration: number;
  playableDuration: number;
  elapsedTime: number;
}

export interface IProgressProp {
  currentTime: number;
  playableDuration: number;
  seekableDuration: number;
}

export interface IProgressRef {
  current: IProgressProp;
}

export interface IInternalPlayer {
  // playerId tracks which react node currently contains the visible player.
  // It is only used on iOS for reparenting. You shouldn't touch this.
  playerId: string;
  setPlayerId: React.Dispatch<React.SetStateAction<string>>;

  // Seek and Skip handlers are used by your VideoComponent to specify which
  // function should be called when the seek()/skip() methods are used.
  // These should only be called once! The last function given is what's used,
  // calling multiple times will overwrite earlier handlers that were passed.
  setSeekHandler: React.Dispatch<React.SetStateAction<IPlayerControls['seek']>>;
  setSkipHandler: React.Dispatch<React.SetStateAction<IPlayerControls['skip']>>;

  // Used by the internal VideoComponent to inform of playhead updates
  updatePlayhead: React.Dispatch<React.SetStateAction<IPlayhead>>;
}
