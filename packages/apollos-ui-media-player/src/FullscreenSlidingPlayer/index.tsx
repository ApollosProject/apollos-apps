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
  VideoComponent?: React.FunctionComponent;
  /** Component that is displayed above the video */
  ControlsComponent?: React.FunctionComponent<{
    collapsedAnimation?: Animated.Value;
  }>;

  collapseOnScroll?: boolean;
}

const FullscreenSlidingPlayer: React.FunctionComponent<FullScreenSlidingPlayerProps> = ({
  ControlsComponent,
  VideoComponent,
  children,
  collapseOnScroll = true,
}) => {
  // Setup layout and window objects for size references inside of computed
  // styles that are below.
  const [layout, setLayout] = React.useState({
    x: 0,
    y: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
  const window = Dimensions.get('screen');

  // pictureMode is used to detect fullscreen status, which drives
  // triggering the fullscreenAnimation and opening the ModalView.
  // It is also used to detect PiP mode which forces the collapse effect.
  const { pictureMode } = usePlayerControls();
  const isFullscreen = pictureMode === PictureMode.Fullscreen;
  const isPiP = pictureMode === PictureMode.PictureInPicture;

  const fullscreenAnimation = React.useRef(new Animated.Value(0)).current;
  Animated.spring(fullscreenAnimation, {
    toValue: isFullscreen ? 1 : 0,
    useNativeDriver: false, // todo
    overshootClamping: true,
  }).start();

  // Setup the collapsedAnimation and collapse effect.
  // The collapse effect is tied to the collapseOnScroll bool and PiP mode.
  const scrollViewRef = React.useRef<ScrollView | null>();
  const videoHeight: number = Math.min(
    // TODO: calculate this another way?
    layout.height * 0.4,
    Math.max(1, layout.width * (9 / 16))
  );
  const { top } = useSafeAreaInsets();
  // TODO: 41 is a magic number from iOS...
  const collapsedVideoHeight = top + 41;

  const [collapsedAnimation, handleScroll] = useVideoCollapseEffect({
    videoHeight,
    collapsedVideoHeight,
    scrollTo: scrollViewRef.current?.scrollTo,
    forceCollapsed: isPiP,
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
        outputRange: [layout.width, window.width],
        extrapolate: 'clamp',
      }),
      height: presentationAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [collapsedVideoHeight, videoHeight, window.height],
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

  const FullscreenWrapper = React.useMemo(() => {
    // We have to wrap fullscreen view in <Modal> on iOS in order to make sure
    // the player is presented on top of ReactNavigation Native Navigation views
    if (Platform.OS !== 'ios') return () => null;
    const Wrapper: React.FunctionComponent = (props) => (
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
        {...props}
      />
    );
    return Wrapper;
  }, [isFullscreen]);

  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={({ nativeEvent: { layout: _layout } }) => setLayout(_layout)}
    >
      <Animated.ScrollView
        ref={(ref) => {
          let node: ScrollView | null = null;
          // So...this is annoying. Animated.ScrollView's ref works differently
          // and this ref can be 3 different things. I can't get typescript
          // to accept that ref?.getNode effectively checks for one of those
          // 3 types, and instanceof doens't work. So...I do this.
          // I think it's safe. It's also what is recommended here:
          // https://github.com/facebook/react-native/issues/19650#issue-331142775
          // @ts-ignore
          if (ref?.getNode) {
            // @ts-ignore
            node = ref.getNode();
          } else {
            // @ts-ignore
            node = ref;
          }
          scrollViewRef.current = node;
        }}
        scrollEventThrottle={16}
        onScroll={collapseOnScroll || isPiP ? handleScroll : undefined}
        style={StyleSheet.absoluteFill}
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
      <Animated.View style={presentationStyles}>
        <VideoPresentationContainer VideoComponent={VideoComponent} />
        {!isFullscreen && ControlsComponent ? (
          <ControlsComponent collapsedAnimation={collapsedAnimation} />
        ) : null}
      </Animated.View>

      {/* iOS-only modal-based fullScreen controls */}
      <FullscreenWrapper>
        <Animated.View
          style={[presentationStyles, fullscreenPresentationStyles]}
        >
          {isFullscreen ? <VideoOutlet /> : null}
          {isFullscreen && ControlsComponent ? <ControlsComponent /> : null}
        </Animated.View>
      </FullscreenWrapper>

      <StatusBar
        hidden={isFullscreen}
        showHideTransition="slide"
        barStyle="light-content"
      />
    </View>
  );
};

export default FullscreenSlidingPlayer;
