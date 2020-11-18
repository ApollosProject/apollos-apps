import * as React from 'react';
import { Animated, Platform, Dimensions } from 'react-native';
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
  forceCollapsed = false, // whether to force the view into a collapsed mode
}: {
  videoHeight: number;
  collapsedVideoHeight: number;
  scrollTo?: (pos: { y: number }) => void;
  forceCollapsed: boolean;
}): [
  Animated.Value,
  ({
    nativeEvent: {
      contentOffset: { y },
    },
  }: any) => void
] => {
  const window = Dimensions.get('window');
  const collapsedAnimation = React.useRef(new Animated.Value(0)).current;
  const percentCollapsedRef = React.useRef(0);

  const collapsedOffset =
    Platform.OS === 'ios' ? -(videoHeight - collapsedVideoHeight) : 0;

  const startingY = Platform.OS === 'ios' ? -videoHeight : 0;
  const collapsedY =
    Platform.OS === 'ios'
      ? -collapsedVideoHeight
      : videoHeight - collapsedVideoHeight;

  const debouncedScrollHandler = useDebouncedCallback((percentageCollapsed) => {
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
      let percentageCollapsed = -(y - startingY) / collapsedOffset;
      // handle the "stretchy effect"
      if (percentageCollapsed < 0) {
        percentageCollapsed = (y - startingY) / (window.height - videoHeight);
      }
      collapsedAnimation.setValue(percentageCollapsed);
      debouncedScrollHandler.callback(percentageCollapsed);
      percentCollapsedRef.current = percentageCollapsed;
    },
    [
      window.height,
      collapsedOffset,
      startingY,
      debouncedScrollHandler,
      videoHeight,
      collapsedAnimation,
    ]
  );

  // handle forceCollapsed mode
  React.useEffect(() => {
    if (scrollTo) {
      if (forceCollapsed && percentCollapsedRef.current < 1) {
        scrollTo({ y: collapsedY });
      } else if (!forceCollapsed && percentCollapsedRef.current <= 1) {
        setTimeout(() => scrollTo({ y: startingY }), 250);
      }
    }
  }, [forceCollapsed, scrollTo, collapsedY, startingY]);

  return [collapsedAnimation, scrollHandler];
};

export default useVideoCollapseEffect;
