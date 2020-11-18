import * as React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { Text } from 'react-native';

import {
  ApollosPlayerContainer,
  useNowPlaying,
  usePlayerControls,
  PictureMode,
} from '@apollosproject/ui-media-player';

const PlayerExamples = () => {
  console.log('rendering PlayerExamples');
  const { setNowPlaying } = useNowPlaying();
  const { setPictureMode, play } = usePlayerControls();

  return (
    <>
      <Text
        onPress={() => {
          setNowPlaying({
            source: require('./broadchurch.mp4'),
            coverImage: {
              uri: `https://picsum.photos/seed/${Math.random()}/100/100`,
            },
            presentationProps: {
              title: 'Video Title',
              description: 'Video Description',
            },
          });
          play();
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
          play();
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
          play();
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
          play();
        }}
      >
        Play LIVE streaming M3u8
      </Text>
      <Text onPress={() => setPictureMode(PictureMode.Fullscreen)}>
        Open fullscreen
      </Text>
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
    coverImage={{
      uri: `https://picsum.photos/seed/${Math.random()}/100/100`,
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

storiesOf('@apollosproject/ui-media-player', module).add(
  'Basic Player',
  BasicPlayer
);
