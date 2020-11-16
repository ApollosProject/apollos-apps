import * as React from 'react';
import { View, Animated, StyleSheet, PanResponder } from 'react-native';
import { styled, withTheme } from '@apollosproject/ui-kit';
import usePlayer from '../usePlayer';

import type { IProgressProp } from '../types';
import { InternalPlayerContext } from '../context';

import Timestamp from './Timestamp';

const Container = styled(
  ({ theme }: any) => ({
    width: '100%',
    paddingHorizontal: theme?.sizing?.baseUnit,
    paddingBottom: theme?.sizing?.baseUnit,
  }),
  'ApollosPlayer.MediaPlayer.Seeker.Container'
)(View);

const TrackContainer = styled(
  ({ minimal, knobSize }: any) => ({
    height: knobSize / 3,
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: minimal ? 20 : knobSize / 3,
    paddingBottom: minimal ? 0 : knobSize / 3,
  }),
  'ApollosPlayer.MediaPlayer.Seeker.TrackContainer'
)(View);

const Track = styled(
  ({ theme, minimal, knobSize }: any) => ({
    height: knobSize / 3,
    overflow: 'hidden',
    borderRadius: minimal ? 0 : knobSize / 3,
    backgroundColor: minimal
      ? theme?.colors?.transparent
      : theme?.colors?.text?.tertiary,
  }),
  'ApollosPlayer.MediaPlayer.Seeker.Track'
)(View);

const ProgressBar = styled(
  ({ theme }: any) => ({
    height: theme?.sizing?.baseUnit,
    backgroundColor: theme?.colors?.text?.secondary,
  }),
  'ApollosPlayer.MediaPlayer.Seeker.ProgressBar'
)(View);

// to create hit slop the actual Knob view is larger then the visible knob.
const KnobInside = styled(
  ({ knobSize, theme }: any) => ({
    width: knobSize,
    height: knobSize,
    elevation: 2,
    borderRadius: theme?.sizing?.baseUnit,
    backgroundColor: theme?.colors?.text?.primary,
  }),
  'ApollosPlayer.MediaPlayer.Seeker.KnobInside'
)(View);

const Knob = styled(
  ({ theme, knobSize }: any) => ({
    position: 'absolute',
    padding: theme?.sizing?.baseUnit, // hitslop
    bottom: -theme?.sizing?.baseUnit - knobSize / 3,
    left: -theme?.sizing?.baseUnit - knobSize / 3,
  }),
  'ui-media.MediaPlayer.Seeker.Knob'
)(({ knobSize, ...props }: any) => (
  <View {...props}>
    <KnobInside knobSize={knobSize} />
  </View>
));

const Seeker = ({
  minimal = false,
  knobSize,
}: {
  minimal: Boolean;
  knobSize: number;
}) => {
  const {
    onProgress,
    setIsControlVisibilityLocked,
    playheadRef,
  } = React.useContext(InternalPlayerContext);
  const currentProgressValue = React.useRef(
    new Animated.Value(
      playheadRef.current.currentTime /
        Math.max(playheadRef.current.playableDuration, 1)
    )
  ).current;

  const isSeekingRef = React.useRef(false);
  const layoutWidthRef = React.useRef(1);

  const { seek } = usePlayer();

  React.useEffect(
    () =>
      onProgress(({ currentTime, playableDuration }: IProgressProp) => {
        if (isSeekingRef.current) return;
        currentProgressValue.setValue(
          currentTime / Math.max(playableDuration, 1)
        );
      }),
    [onProgress, currentProgressValue]
  );

  const trackBarWidth = React.useMemo(() => {
    return currentProgressValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });
  }, [currentProgressValue]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          isSeekingRef.current = true;
          setIsControlVisibilityLocked(true);
        },
        onPanResponderMove: (_, { dx }) => {
          const progressAtStart =
            playheadRef.current.currentTime /
            Math.max(1, playheadRef.current.playableDuration);

          const offsetProgress = dx / layoutWidthRef.current;

          currentProgressValue.setValue(progressAtStart + offsetProgress);
        },
        onPanResponderRelease: async (_, { dx }) => {
          const progressAtStart =
            playheadRef.current.currentTime /
            Math.max(1, playheadRef.current.playableDuration);
          const offsetProgress = dx / layoutWidthRef.current;

          const newProgress = progressAtStart + offsetProgress;

          const newSeekValue =
            newProgress * playheadRef.current.playableDuration;

          seek(newSeekValue);
          isSeekingRef.current = false;
          setIsControlVisibilityLocked(false);
        },
      }),
    [currentProgressValue, setIsControlVisibilityLocked, seek, playheadRef]
  );

  return (
    <Container>
      <TrackContainer minimal={minimal} knobSize={knobSize}>
        <Track
          onLayout={(e: any) => {
            layoutWidthRef.current = e?.nativeEvent?.layout?.width;
          }}
          minimal={minimal}
          knobSize={knobSize}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                width: trackBarWidth,
              },
            ]}
          >
            <ProgressBar />
          </Animated.View>
        </Track>
        <Animated.View
          style={[
            {
              left: trackBarWidth,
            },
          ]}
        >
          {!minimal ? (
            <Knob knobSize={knobSize} {...panResponder.panHandlers} />
          ) : null}
        </Animated.View>
      </TrackContainer>
      {minimal ? null : <Timestamp />}
    </Container>
  );
};

const ThemedSeeker = withTheme(({ theme }: any) => ({
  knobSize: Math.floor(theme?.sizing?.baseUnit * 0.75),
}))(Seeker);

export default ThemedSeeker;
