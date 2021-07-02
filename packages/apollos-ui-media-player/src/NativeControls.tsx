import { useEffect } from 'react';
import { Platform } from 'react-native';
import MusicControl, { Command } from 'react-native-music-control';

import { useNowPlaying, usePlayerControls, usePlayhead } from './context';

export default () => {
  const nowPlaying = useNowPlaying();
  const { isPlaying, play, pause, skip, seek } = usePlayerControls();
  const { totalDuration, elapsedTime } = usePlayhead();

  // configure controls and handle unmount
  useEffect(() => {
    MusicControl.enableBackgroundMode(true);
    // broken on Android
    if (Platform.OS === 'ios') MusicControl.handleAudioInterruptions(true);
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('changePlaybackPosition', true);
    MusicControl.enableControl('seek', true);
    MusicControl.enableControl('skipBackward', true, { interval: 30 });
    MusicControl.enableControl('skipForward', true, { interval: 30 });
    MusicControl.enableControl('togglePlayPause', true);
    return () => {
      MusicControl.stopControl();
    };
  }, []);

  // set metadata when media changes
  useEffect(() => {
    MusicControl.setNowPlaying({
      title: nowPlaying?.presentationProps?.title,
      // URL or RN's image require()
      artwork: Array.isArray(nowPlaying?.coverImage)
        ? nowPlaying?.coverImage?.[0]?.uri
        : nowPlaying?.coverImage?.uri,
      //artist: 'Church',
      //album: 'Sermons - Series',
      //genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
      duration: totalDuration, // (Seconds)
      description: nowPlaying?.presentationProps?.description, // Android Only
      color: 0xffffff, // Android Only - Notification Color
      colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
      //date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
      //rating: 84, // Android Only (Boolean or Number depending on the type)
      //notificationIcon: 'my_custom_icon', // Android Only (String), Android Drawable resource name for a custom notification icon
      isLiveStream: nowPlaying?.isLive ?? false, // iOS Only (Boolean), Show or hide Live Indicator instead of seekbar on lock screen for live streams. Default value is false.
    });
    MusicControl.enableControl('changePlaybackPosition', !nowPlaying?.isLive);
    MusicControl.enableControl('seek', !nowPlaying?.isLive);
  }, [nowPlaying, totalDuration]);

  // configure listeners
  useEffect(() => {
    MusicControl.on(Command.play, play);
    MusicControl.on(Command.pause, pause);
    MusicControl.on(Command.skipBackward, () => {
      skip(-30);
    });
    MusicControl.on(Command.skipForward, () => {
      skip(30);
    });
    MusicControl.on(Command.togglePlayPause, () =>
      isPlaying ? pause() : play()
    );
    MusicControl.on(Command.changePlaybackPosition, (pos) => seek(pos));
    MusicControl.on(Command.seek, (pos) => seek(pos));
    MusicControl.on(Command.closeNotification, () => {
      pause();
      seek(0);
    });
    MusicControl.updatePlayback({
      state: isPlaying ? MusicControl.STATE_PLAYING : MusicControl.STATE_PAUSED,
      elapsedTime,
    });
  }, [play, pause, isPlaying, skip, seek, elapsedTime]);

  return null;
};
