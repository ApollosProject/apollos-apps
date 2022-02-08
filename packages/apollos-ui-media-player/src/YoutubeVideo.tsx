import * as React from 'react';
import { styled } from '@apollosproject/ui-kit';
import { StyleSheet, View } from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { useNowPlaying, usePlayerControls, useInternalPlayer } from './context';

const Container = styled(
  ({ theme }: any) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black,
    overflow: 'hidden',
  }),
  'ApollosPlayer.RNVideoPresentation.Container'
)(View);

export const youtubeRegEx = new RegExp(
  /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\W/
);

const YoutubeVideoPresentation = () => {
  const nowPlaying = useNowPlaying();
  const { isPlaying, play, pause } = usePlayerControls();
  const {
    setSkipHandler,
    setSeekHandler,
    updatePlayhead,
  } = useInternalPlayer();
  const videoRef = React.useRef<YoutubeIframeRef>(null);

  const [layout, setLayout] = React.useState({ width: 0, height: 0 });
  const handleLayout = React.useCallback((event) => {
    setLayout(event.nativeEvent.layout);
  }, []);

  const youtubeId =
    nowPlaying.source?.html?.match(youtubeRegEx)?.[1] ||
    nowPlaying.source?.uri?.match(youtubeRegEx)?.[1];

  const playheadRef = React.useRef({
    totalDuration: 1,
    seekableDuration: 1,
    playableDuration: 1,
    elapsedTime: 0,
  });

  React.useEffect(() => {
    const interval = setInterval(async () => {
      const elapsedTime = (await videoRef.current?.getCurrentTime()) || 0;
      const totalDuration = (await videoRef.current?.getDuration()) || 1;

      const newPlayhead = {
        totalDuration,
        seekableDuration: totalDuration,
        playableDuration: totalDuration,
        elapsedTime,
      };

      playheadRef.current = newPlayhead;
      updatePlayhead(newPlayhead);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [updatePlayhead]);

  const handleChangeState = React.useCallback(
    (state) => {
      if (state === 'playing') {
        play();
      } else if (state !== 'buffering') {
        pause();
      }
    },
    [pause, play]
  );

  const skip = React.useCallback(
    (skipBy: number) => {
      videoRef?.current?.seekTo(
        Math.max(
          0,
          Math.min(
            playheadRef.current.elapsedTime + skipBy,
            playheadRef.current.totalDuration
          )
        ),
        true
      );
    },
    [videoRef, playheadRef]
  );

  React.useEffect(() => setSkipHandler(() => skip), [setSkipHandler, skip]);

  const seek = React.useCallback(
    (seekTo: number) => {
      videoRef?.current?.seekTo(seekTo, true);
      updatePlayhead({
        ...playheadRef.current,
        elapsedTime: seekTo,
      });
    },
    [videoRef, playheadRef, updatePlayhead]
  );

  React.useEffect(() => setSeekHandler(() => seek), [setSeekHandler, seek]);

  return (
    <Container onLayout={handleLayout}>
      <YoutubePlayer
        ref={videoRef}
        play={isPlaying}
        videoId={youtubeId}
        onChangeState={handleChangeState}
        height={layout.height}
        width={layout.width}
      />
    </Container>
  );
};

export default YoutubeVideoPresentation;
