export MediaPlayerProvider, { defaults, schema } from './Provider';
export MediaPlayer from './MediaPlayer';

export { MINI_PLAYER_HEIGHT } from './MediaPlayer/MiniControls';
export MediaPlayerSpacer from './MediaPlayer/MediaPlayerSpacer';
export withTabBarMediaSpacer from './tabBarWithMediaSpacer';

export {
  pauseAndRestart,
  playVideoMutation,
  goFullscreen,
  play,
  pause,
  dismiss,
  exitFullscreen,
  updatePlayhead,
  mute,
  unmute,
  showVideo,
  hideVideo,
} from './MediaPlayer/mutations';
