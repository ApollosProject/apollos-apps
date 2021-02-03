import * as React from 'react';
import {
  Animated,
  StyleSheet,
  StatusBar,
  Platform,
  Modal,
  Dimensions,
  View,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PictureMode } from '../types';
import { usePlayerControls } from '../context';
import VideoPresentationContainer from '../VideoPresentationContainer';
import VideoOutlet from '../VideoOutlet';

import useVideoCollapseEffect from './useVideoCollapseEffect';
import usePresentationAnimation from './usePresentationAnimation';

export interface FullScreenSlidingPlayerProps {
  /** Component that renders the actual video. Default: react-native-video */
  VideoComponent?: React.FunctionComponent<{
    useNativeFullscreeniOS?: boolean;
  }>;
  /** Component that is displayed above the video */
  ControlsComponent?: React.FunctionComponent<{
    collapsedAnimation?: Animated.Value;
  }>;

  collapseOnScroll?: boolean;
  useNativeFullscreeniOS?: boolean;

  scrollViewRef?:
    | ((instance: ScrollView | null) => void)
    | React.RefObject<ScrollView>;
}

const FullscreenSlidingPlayer: React.FunctionComponent<FullScreenSlidingPlayerProps> = ({
  ControlsComponent,
  VideoComponent,
  children,
  collapseOnScroll = false,
  useNativeFullscreeniOS = false,
  scrollViewRef: scrollViewRefProp,
}) => {
  // Setup layout and window objects for size references inside of computed
  // styles that are below.
  const [layout, setLayout] = React.useState({
    x: 0,
    y: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  const window = useWindowDimensions();

  // pictureMode is used to detect fullscreen status, which drives
  // triggering the fullscreenAnimation and opening the ModalView.
  // It is also used to detect PiP mode which forces the collapse effect.
  const { pictureMode } = usePlayerControls();
  const isFullscreen = pictureMode === PictureMode.Fullscreen;
  const isPiP = pictureMode === PictureMode.PictureInPicture;

  const fullscreenAnimation = React.useRef(new Animated.Value(0)).current;
  if (Platform.OS === 'android' || !useNativeFullscreeniOS) {
    Animated.spring(fullscreenAnimation, {
      toValue: isFullscreen ? 1 : 0,
      useNativeDriver: false, // todo
      overshootClamping: true,
    }).start();
  }

  // Setup the collapsedAnimation and collapse effect.
  // The collapse effect is tied to the collapseOnScroll bool and PiP mode.
  const scrollViewRef = React.useRef<ScrollView | null>();
  if (scrollViewRef.current && scrollViewRefProp) {
    if (typeof scrollViewRefProp === 'function') {
      scrollViewRefProp(scrollViewRef.current);
    } else {
      // @ts-ignore
      scrollViewRefProp.current = scrollViewRef.current;
    }
  }

  const videoHeight: number = Math.min(
    // TODO: calculate this another way?
    layout.height * 0.4,
    Math.max(1, layout.width * (9 / 16))
  );
  const { top } = useSafeAreaInsets();
  // TODO: these magic numbers always suck
  const appBarHeight =
    Platform.OS === 'ios' ? (window.width > window.height ? 32 : 44) : 56;
  const collapsedVideoHeight = top + appBarHeight;

  const [collapsedAnimation, handleScroll] = useVideoCollapseEffect({
    videoHeight,
    collapsedVideoHeight,
    scrollTo: scrollViewRef.current?.scrollTo,
    collapseOnScroll: collapseOnScroll || isPiP,
  });

  // presentationAnimation has 3 states:
  // -1 = collapsed
  // 0 = normal
  // 1 = fullscreen
  const presentationAnimation = usePresentationAnimation({
    fullscreenAnimation,
    collapsedAnimation,
  });

  // fullscreen styles basically blow the container up to fill the screen.
  // the top and left offset is to support different modal modes such as on iPad
  const fullscreenPresentationStyles = React.useMemo(
    () => [
      StyleSheet.absoluteFill,
      {
        zIndex: 99999,
        top: window.height - layout.height,
        left: window.width - layout.width,
      },
    ],
    [layout.height, layout.width, window.height, window.width]
  );

  // presentation styles handle translating the video during fullscreen anim,
  // and animating the width/height during both collapsing and fullscreen.
  const presentationStyles = React.useMemo(
    () => ({
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      transform: [
        {
          translateY: presentationAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, layout.height - window.height],
            extrapolate: 'clamp',
          }),
        },
        {
          translateX: presentationAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, layout.width - window.width],
            extrapolate: 'clamp',
          }),
        },
      ],
      width: presentationAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [layout.width, Math.max(layout.width, window.width)],
        extrapolate: 'clamp',
      }),
      height: presentationAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [
          collapsedVideoHeight,
          videoHeight,
          Math.max(layout.height, window.height),
        ],
        extrapolate: 'clamp',
      }),
    }),
    [
      videoHeight,
      collapsedVideoHeight,
      presentationAnimation,
      layout.height,
      layout.width,
      window.width,
      window.height,
    ]
  );

  const scrollViewStyles = React.useMemo(
    () => ({
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      transform: [
        {
          translateY: fullscreenAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, window.height],
            extrapolate: 'clamp',
          }),
        },
      ],
    }),
    [fullscreenAnimation, window.height]
  );

  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={({ nativeEvent: { layout: _layout } }) => setLayout(_layout)}
    >
      <Animated.ScrollView
        // So...this is annoying. Animated.ScrollView's ref used to behave
        // differently then other refs in older versions of React-Native.
        // Animated Component refs used to return a { getNode: () => {} } shape,
        // and now they return the actual component. This handles both cases.
        ref={(ref: { getNode: () => ScrollView }) => {
          if (ref?.getNode && typeof ref.getNode === 'function') {
            return ref.getNode();
          } else {
            return ref;
          }
        }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        style={scrollViewStyles}
        contentInset={{ top: videoHeight }}
        contentOffset={{
          x: 0,
          y: -videoHeight,
        }}
      >
        {/* Only iOS supports contentInset and offset above */}
        {Platform.OS !== 'ios' ? (
          <View style={{ height: videoHeight }} />
        ) : null}
        {children}
      </Animated.ScrollView>

      {/* Primary Video View */}
      <Animated.View
        style={[
          presentationStyles,
          isFullscreen ? fullscreenPresentationStyles : null,
        ]}
      >
        <VideoPresentationContainer
          VideoComponent={VideoComponent}
          useNativeFullscreeniOS={useNativeFullscreeniOS}
        />
        {(!isFullscreen || Platform.OS === 'android') && ControlsComponent ? (
          <ControlsComponent collapsedAnimation={collapsedAnimation} />
        ) : null}
      </Animated.View>

      {/* iOS-only modal-based fullScreen controls */}
      {!useNativeFullscreeniOS && Platform.OS === 'ios' ? (
        <Modal
          animationType="fade"
          presentationStyle="overFullScreen"
          hardwareAccelerated
          transparent
          visible={isFullscreen}
          supportedOrientations={[
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
          ]}
        >
          <Animated.View
            style={[presentationStyles, fullscreenPresentationStyles]}
          >
            {isFullscreen ? <VideoOutlet /> : null}
            {isFullscreen && ControlsComponent ? <ControlsComponent /> : null}
          </Animated.View>
        </Modal>
      ) : null}

      <StatusBar
        hidden={isFullscreen}
        showHideTransition="slide"
        barStyle="light-content"
      />
    </View>
  );
};

export default FullscreenSlidingPlayer;
