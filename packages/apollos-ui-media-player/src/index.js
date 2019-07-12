export MediaPlayerProvider, { defaults, schema } from './Provider';
export MediaPlayer from './MediaPlayer';

export { MINI_PLAYER_HEIGHT } from './MediaPlayer/MiniControls';
export MediaPlayerSpacer from './MediaPlayer/MediaPlayerSpacer';
export withTabBarMediaSpacer from './tabBarWithMediaSpacer';

export { GET_VIDEO_STATE } from './MediaPlayer/queries';

export {
  PAUSE_AND_RESTART,
  PLAY_VIDEO,
  GO_FULLSCREEN,
  PLAY,
  PAUSE,
  DISMISS,
  EXIT_FULLSCREEN,
  UPDATE_PLAYHEAD,
  MUTE,
  UNMUTE,
  SHOW_VIDEO,
  HIDE_VIDEO,
} from './MediaPlayer/mutations';
