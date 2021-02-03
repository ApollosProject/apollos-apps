import * as React from 'react';
import { Animated, Platform } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

/**
 * used for animating the "collapsing" effect on the video player when
 * you scroll or swithing to PiP mode.
 * Returns an animated value and a scrollhandler to pass to ScrollView.
 */
const useVideoCollapseEffect = ({
  videoHeight, // The initial height of the video player
  collapsedVideoHeight, // the collapsed height of the video player
  scrollTo, // method called to scroll the scroll view
  collapseOnScroll = true, // turns on or off the collapse while scrolling
}: {
  videoHeight: number;
  collapsedVideoHeight: number;
  scrollTo?: (pos: { y: number }) => void;
  collapseOnScroll: boolean;
}): [
  Animated.Value,
  ({
    nativeEvent: {
      contentOffset: { y },
    },
  }: any) => void
] => {
  const collapsedAnimation = React.useRef(new Animated.Value(0)).current;
  const percentCollapsedRef = React.useRef(0);

  const collapsedOffset = -(videoHeight - collapsedVideoHeight);

  const startingY = Platform.OS === 'ios' ? -videoHeight : 0;
  const collapsedY =
    Platform.OS === 'ios'
      ? -collapsedVideoHeight
      : videoHeight - collapsedVideoHeight;

  const debouncedScrollHandler = useDebouncedCallback((percentageCollapsed) => {
    if (!collapseOnScroll) return;
    if (percentageCollapsed > 1 || !scrollTo) return;
    if (percentageCollapsed > 0.5) {
      scrollTo({ y: collapsedY });
    } else {
      scrollTo({ y: startingY });
    }
  }, 750);

  const scrollHandler = React.useCallback(
    ({
      nativeEvent: {
        contentOffset: { y },
      },
    }) => {
      let percentageCollapsed = Math.max(0, -(y - startingY) / collapsedOffset);
      if (collapseOnScroll) {
        collapsedAnimation.setValue(percentageCollapsed);
        debouncedScrollHandler.callback(percentageCollapsed);
      }
      percentCollapsedRef.current = percentageCollapsed;
    },
    [
      collapseOnScroll,
      collapsedOffset,
      startingY,
      debouncedScrollHandler,
      collapsedAnimation,
    ]
  );

  // handle collapseOnScroll changing
  React.useEffect(() => {
    if (collapseOnScroll) {
      Animated.spring(collapsedAnimation, {
        toValue: percentCollapsedRef.current,
        overshootClamping: true,
        useNativeDriver: false,
      }).start();
    } else {
      // this timeout gives the PiP animation time to complete
      setTimeout(
        () =>
          Animated.spring(collapsedAnimation, {
            toValue: 0,
            overshootClamping: true,
            useNativeDriver: false,
          }).start(),
        250
      );
    }
  }, [collapseOnScroll, collapsedAnimation]);

  return [collapsedAnimation, scrollHandler];
};

export default useVideoCollapseEffect;
