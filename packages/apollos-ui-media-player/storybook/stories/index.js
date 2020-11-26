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
  const { setNowPlaying } = useNowPlaying();
  const { setPictureMode, play } = usePlayerControls();

  return (
    <>
      <Text
        onPress={() => {
          setNowPlaying({
            source: {
              uri:
                'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
            },
            coverImage: {
              uri: `https://picsum.photos/seed/${Math.random()}/100/100`,
            },
            presentationProps: {
              title: 'Remote Video',
              description: 'Video Description',
            },
          });
          play();
        }}
      >
        Play remote MP4
      </Text>
      <Text
        onPress={() => {
          setNowPlaying({
            source: require('./broadchurch.mp4'),
            presentationProps: {
              title: 'Local Video',
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
              title: 'On Demand Stream',
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

            isLive: true,
            presentationProps: {
              title: 'Live Stream',
              description: 'Video Description',
            },
          });
          play();
        }}
      >
        Play LIVE streaming M3u8
      </Text>
      <Text
        onPress={() => {
          setNowPlaying({
            source: {
              uri:
                'https://s3.amazonaws.com/media-files.watermark.org/assets/20201116/985db3f6-d9e9-438c-9c2b-5b8dd69a5866/VFTP-Evil-mixdown.mp3',
            },
            coverImage: {
              uri:
                'https://d3fnu4rii7irnm.cloudfront.net/images/16024/thumb/2800/',
            },
            audioOnly: true,
            presentationProps: {
              title: 'Audio Only',
              description: 'Video Description',
            },
          });
          play();
        }}
      >
        Play Mp3
      </Text>
      <Text onPress={() => setPictureMode(PictureMode.Fullscreen)}>
        Open fullscreen
      </Text>
    </>
  );
};

const BasicPlayer = (props) => (
  <ApollosPlayerContainer
    source={{
      uri:
        'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
    }}
    presentationProps={{
      title: 'Video Title',
      description: 'Video Description',
    }}
    coverImage={{
      uri: `https://picsum.photos/seed/${Math.random()}/100/100`,
    }}
    {...props}
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

storiesOf('@apollosproject/ui-media-player', module)
  .add('Basic Player', BasicPlayer)
  .add('Collapsing Player', () => <BasicPlayer collapseOnScroll />)
  .add('Native iOS Fullscreen', () => <BasicPlayer useNativeFullscreeniOS />);
