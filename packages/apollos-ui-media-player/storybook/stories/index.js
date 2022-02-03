import * as React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { Text } from 'react-native';

import { WebView } from 'react-native-webview';

import {
  ApollosPlayerContainer,
  useNowPlaying,
  usePlayerControls,
  PictureMode,
} from '@apollosproject/ui-media-player';

const ResiHTML = {
  html:
    '<div style="position:relative;overflow:hidden;padding-top:56.25%;">\n  <iframe allow="autoplay; fullscreen" allowfullscreen="true" src="https://control.resi.io/webplayer/video.html?id=NmMwMDI3MzItNzIwMy00MTRkLTgwYTAtYjY2OTU3Njg1YzZhOjQ0NDNiZmZhLTdiOWYtMTFlYy05MWZmLWU1ZDQ2ODFjMTVmNw%3D%3D&type=library&autoplay=false" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"></iframe>\n</div>',
};

const YouTubeHTML = {
  html:
    '<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/qog4M6nyRpE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
};

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

      <Text
        onPress={() => {
          setNowPlaying({
            source: ResiHTML,
            presentationProps: {
              title: 'Web Video',
              description: 'Video Description',
            },
          });
          play();
        }}
      >
        Play Resi Web Embed
      </Text>

      <Text
        onPress={() => {
          setNowPlaying({
            source: YouTubeHTML,
            presentationProps: {
              title: 'YT Video',
              description: 'Video Description',
            },
          });
          play();
        }}
      >
        Play YT Embed
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

const WebViewTest = React.memo(({ source }) => (
  <WebView
    style={{ width: '100%' }}
    bounces={false}
    originWhitelist={['*']}
    allowsFullscreenVideo
    allowsInlineMediaPlayback
    mediaPlaybackRequiresUserAction={false}
    source={source}
  />
));

storiesOf('@apollosproject/ui-media-player', module)
  .add('Basic Player', BasicPlayer)
  .add('Collapsing Player', () => <BasicPlayer collapseOnScroll />)
  .add('Native iOS Fullscreen', () => <BasicPlayer useNativeFullscreeniOS />)
  .add('Resi WebView Embed', () => <BasicPlayer source={ResiHTML} />)
  .add('YouTube WebView Embed', () => <BasicPlayer source={YouTubeHTML} />);
