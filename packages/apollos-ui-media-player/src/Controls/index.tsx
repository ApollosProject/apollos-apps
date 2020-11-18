import * as React from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Animated,
  StyleSheet,
} from 'react-native';
import {
  ThemeMixin,
  styled,
  withTheme,
  ButtonIcon,
} from '@apollosproject/ui-kit';

import FadeoutOverlay from './FadeoutOverlay';
import { usePlayerControls } from '../context';

import Header from './Header';
import Seeker from './Seeker';

import AirPlayButton from '../AirPlayButton';
import { PictureMode } from '../types';
import CollapsedHeader from './CollapsedHeader';

const FooterWrapper = styled(
  {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  'ApollosPlayer.Controls.FooterWrapper'
)(SafeAreaView);

const FooterControls = styled(
  ({ theme }: any) => ({
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme?.sizing?.baseUnit,
  }),
  'ApollosPlayer.Controls.FooterControls'
)(View);

const IconSm = withTheme(
  ({ theme }: any) => ({
    size: theme?.sizing?.baseUnit * 1.25,
    iconPadding: theme?.sizing?.baseUnit,
    fill: theme?.colors?.text?.secondary,
  }),
  'ApollosPlayer.Controls.FullscreenControls.IconSm'
)(ButtonIcon);

const IconMd = withTheme(
  ({ theme }: any) => ({
    size: theme?.sizing?.baseUnit * 2,
    iconPadding: theme?.sizing?.baseUnit,
  }),
  'ApollosPlayer.Controls.FullscreenControls.IconMd'
)(ButtonIcon);

const StyledAirPlayButton = withTheme(
  ({ theme }: any) => ({
    style: {
      width: theme?.sizing?.baseUnit * 1.25,
      height: theme?.sizing?.baseUnit * 1.25,
      paddingHorizontal: theme?.sizing?.baseUnit,
    },
    activeTintColor: theme?.colors?.primary,
    tintColor: theme?.colors?.text?.secondary,
  }),
  'ApollosPlayer.FullscreenPresentation.FullscreenControls.AirPlayButton'
)(AirPlayButton);

const Controls = ({
  collapsedAnimation,
}: {
  collapsedAnimation?: Animated.Value;
}) => {
  const {
    pictureMode,
    setPictureMode,
    isPlaying,
    play,
    pause,
    skip,
  } = usePlayerControls();
  const isFullscreen = pictureMode === PictureMode.Fullscreen;
  const isInPiP = pictureMode === PictureMode.PictureInPicture;

  const controlsCollapsedStyles = [
    {
      opacity: collapsedAnimation?.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    },
    StyleSheet.absoluteFill,
  ];

  const collapsedHeaderStyles = [
    { opacity: collapsedAnimation },
    StyleSheet.absoluteFill,
  ];

  return (
    <ThemeMixin mixin={{ type: 'dark' }}>
      <StatusBar hidden={isFullscreen} />
      {isFullscreen ? null : (
        <Animated.View style={collapsedHeaderStyles}>
          <CollapsedHeader />
        </Animated.View>
      )}
      {isInPiP ? null : (
        <Animated.View style={controlsCollapsedStyles}>
          <FadeoutOverlay>
            {isFullscreen ? <Header /> : null}
            <FooterWrapper>
              <FooterControls>
                <StyledAirPlayButton />
                <IconMd name="skip-back-thirty" onPress={() => skip(-30)} />
                <IconMd
                  name={isPlaying ? 'pause' : 'play'}
                  onPress={isPlaying ? pause : play}
                />
                <IconMd name="skip-forward-thirty" onPress={() => skip(30)} />
                <IconSm
                  name="fullscreen"
                  onPress={() =>
                    setPictureMode(
                      isFullscreen ? PictureMode.Normal : PictureMode.Fullscreen
                    )
                  }
                />
              </FooterControls>
              <Seeker />
            </FooterWrapper>
          </FadeoutOverlay>
        </Animated.View>
      )}
    </ThemeMixin>
  );
};

export default Controls;
