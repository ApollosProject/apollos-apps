import * as React from 'react';
import { styled } from '@apollosproject/ui-kit';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import { useNowPlaying } from './context';

const Container = styled(
  ({ theme }: any) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black,
    overflow: 'hidden',
  }),
  'ApollosPlayer.RNVideoPresentation.Container'
)(View);

const getSourceHtml = (html: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    >
    <style>
      body, html {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
  ${html}
  </body>
</html>
`;

const WebVideoPresentation = () => {
  const nowPlaying = useNowPlaying();

  const source = React.useMemo(() => {
    if (nowPlaying?.source?.html)
      return { html: getSourceHtml(nowPlaying.source.html) };
    if (nowPlaying?.source?.uri) return { uri: nowPlaying.source.uri };
    return undefined;
  }, [nowPlaying?.source?.html, nowPlaying?.source?.uri]);

  return (
    <Container>
      <WebView
        bounces={false}
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        source={source}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
      />
    </Container>
  );
};

export default WebVideoPresentation;
