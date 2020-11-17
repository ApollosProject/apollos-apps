import * as React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { Text } from 'react-native';

import {
  ApollosPlayerContainer,
  usePlayer,
} from '@apollosproject/react-native-apollos-player';

const PlayerExamples = () => {
  const { setNowPlaying, setIsPlaying, setIsFullscreen } = usePlayer();

  return (
    <>
      <Text
        onPress={() => {
          setNowPlaying({
            source: require('./broadchurch.mp4'),
            coverImage: { uri: 'https://picsum.photos/100/100' },
            presentationProps: {
              title: 'Video Title',
              description: 'Video Description',
            },
          });
          setIsPlaying(true);
        }}
      >
        Play local MP4
      </Text>
      <Text
        onPress={() => {
          setNowPlaying({
            source: require('./broadchurch.mp4'),
            presentationProps: {
              title: 'Video Title',
              description: 'Video Description',
            },
          });
          setIsPlaying(true);
        }}
      >
        Play local MP4 (no cover image)
      </Text>
      <Text
        onPress={() => {
          setNowPlaying({
            source: {
              uri:
                'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
            },
            presentationProps: {
              title: 'Video Title',
              description: 'Video Description',
            },
          });
          setIsPlaying(true);
        }}
      >
        Play streaming M3u8
      </Text>
      <Text
        onPress={() => {
          setNowPlaying({
            source: {
              uri:
                'https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8',
            },
            presentationProps: {
              title: 'Video Title',
              description: 'Video Description',
              badge: (
                <Text style={{ color: 'white' }}>
                  <Text style={{ color: 'red' }}>●</Text> Live
                </Text>
              ),
            },
          });
          setIsPlaying(true);
        }}
      >
        Play LIVE streaming M3u8
      </Text>
      <Text onPress={() => setIsFullscreen(true)}>Open fullscreen</Text>
    </>
  );
};

const BasicPlayer = () => (
  <ApollosPlayerContainer
    source={require('./broadchurch.mp4')}
    presentationProps={{
      title: 'Video Title',
      description: 'Video Description',
    }}
  >
    <PlayerExamples />
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
    <Text>---------</Text>
  </ApollosPlayerContainer>
);

storiesOf('react-native-apollos-player', module).add(
  'Basic Player',
  BasicPlayer
);
