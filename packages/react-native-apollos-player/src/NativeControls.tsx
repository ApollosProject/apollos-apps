import { useContext, useEffect } from 'react';
import MusicControl from 'react-native-music-control';
import { NowPlayingContext, InternalPlayerContext } from './context';

export default () => {
  const { nowPlaying, setIsPlaying, skip } = useContext(NowPlayingContext);
  const { playheadRef } = useContext(InternalPlayerContext);

  useEffect(() => {
    MusicControl.enableBackgroundMode(true);
    MusicControl.handleAudioInterruptions(true);

    MusicControl.enableControl('play', true);
    // @ts-ignore
    MusicControl.on('play', () => {
      setIsPlaying(true);
    });

    MusicControl.enableControl('skipBackward', true, { interval: 30 });
    // @ts-ignore
    MusicControl.on('skipBackward', () => {
      skip(30);
    });
    MusicControl.enableControl('skipForward', true, { interval: 30 });
    // @ts-ignore
    MusicControl.on('skipForward', () => {
      skip(-30);
    });

    MusicControl.setNowPlaying({
      title: nowPlaying?.presentationProps?.title,
      // URL or RN's image require()
      artwork: Array.isArray(nowPlaying?.coverImage)
        ? nowPlaying?.coverImage?.[0]?.uri
        : nowPlaying?.coverImage?.uri,
      //artist: 'Church',
      //album: 'Sermons - Series',
      //genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
      duration: playheadRef?.current?.playableDuration, // (Seconds)
      description: nowPlaying?.presentationProps?.description, // Android Only
      color: 0xffffff, // Android Only - Notification Color
      colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
      //date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
      //rating: 84, // Android Only (Boolean or Number depending on the type)
      //notificationIcon: 'my_custom_icon', // Android Only (String), Android Drawable resource name for a custom notification icon
      //isLiveStream: true, // iOS Only (Boolean), Show or hide Live Indicator instead of seekbar on lock screen for live streams. Default value is false.
    });

    // unmount
    return () => {
      MusicControl.stopControl();
    };
  }, [nowPlaying, playheadRef, setIsPlaying, skip]);

  return null;
};
