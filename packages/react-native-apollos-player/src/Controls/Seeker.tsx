import * as React from 'react';
import { View, Animated, StyleSheet, PanResponder } from 'react-native';
import { styled, withTheme } from '@apollosproject/ui-kit';
import { usePlayerControls, usePlayhead } from '../context';

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
  const { elapsedTime, totalDuration } = usePlayhead();
  const {
    setIsControlVisibilityLocked,
    isControlVisibilityLocked,
    seek,
  } = usePlayerControls();

  const layoutWidthRef = React.useRef(1);

  const currentProgress = elapsedTime / Math.max(totalDuration, 1);

  // Okay, this is kind of bummer but these are refs so that the PanResponder
  // function below will not re-initialize while panning...which would cause
  // the panresponder to go bonkers if it happened. Here's a cookie 🥠
  const currentProgressRef = React.useRef(currentProgress);
  const totalDurationRef = React.useRef(totalDuration);

  const currentProgressAnimation = React.useRef(
    new Animated.Value(currentProgress)
  ).current;

  if (!isControlVisibilityLocked) {
    currentProgressAnimation.setValue(currentProgress);
    currentProgressRef.current = currentProgress;
    totalDurationRef.current = totalDuration;
  }

  const trackBarWidth = React.useMemo(() => {
    return currentProgressAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });
  }, [currentProgressAnimation]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setIsControlVisibilityLocked(true);
        },
        onPanResponderMove: (_, { dx }) => {
          const progressAtStart = currentProgressRef.current;

          const offsetProgress = dx / layoutWidthRef.current;

          currentProgressAnimation.setValue(progressAtStart + offsetProgress);
        },
        onPanResponderRelease: async (_, { dx }) => {
          const progressAtStart = currentProgressRef.current;
          const offsetProgress = dx / layoutWidthRef.current;

          const newProgress = progressAtStart + offsetProgress;

          console.log('onPanResponderRelease', {
            progressAtStart,
            offsetProgress,
            newProgress,
            dx,
          });

          const newSeekValue = newProgress * totalDurationRef.current;

          seek(newSeekValue);
          setIsControlVisibilityLocked(false);
        },
      }),
    [
      currentProgressRef,
      totalDurationRef,
      currentProgressAnimation,
      setIsControlVisibilityLocked,
      seek,
    ]
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
