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
import LiveLabel from './LiveLabel';
import { usePlayerControls, useNowPlaying } from '../context';

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
  {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
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
    size: theme?.sizing?.baseUnit * 1.5,
    iconPadding: theme?.sizing?.baseUnit,
  }),
  'ApollosPlayer.Controls.FullscreenControls.IconMd'
)(ButtonIcon);

const IconLg = withTheme(
  ({ theme }: any) => ({
    size: theme?.sizing?.baseUnit * 2.25,
    iconPadding: theme?.sizing?.baseUnit,
  }),
  'ApollosPlayer.Controls.FullscreenControls.IconLg'
)(ButtonIcon);

const IconWrapper = styled(({ theme }: any) => ({
  width: theme?.sizing?.baseUnit * 4,
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const StyledAirPlayButton = withTheme(
  ({ theme }: any) => ({
    style: {
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
  const { isLive } = useNowPlaying();
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
                <IconWrapper>
                  <StyledAirPlayButton />
                </IconWrapper>

                {!isLive ? (
                  <IconWrapper>
                    <IconMd name="skip-back-thirty" onPress={() => skip(-30)} />
                  </IconWrapper>
                ) : null}

                <IconWrapper>
                  <IconLg
                    name={isPlaying ? 'pause' : 'play'}
                    onPress={isPlaying ? pause : play}
                  />
                </IconWrapper>

                {!isLive ? (
                  <IconWrapper>
                    <IconMd
                      name="skip-forward-thirty"
                      onPress={() => skip(30)}
                    />
                  </IconWrapper>
                ) : null}

                <IconWrapper>
                  <IconSm
                    name={isFullscreen ? 'arrow-in' : 'arrow-out'}
                    onPress={() =>
                      setPictureMode(
                        isFullscreen
                          ? PictureMode.Normal
                          : PictureMode.Fullscreen
                      )
                    }
                  />
                </IconWrapper>
              </FooterControls>
              {!isLive ? <Seeker /> : <LiveLabel />}
            </FooterWrapper>
          </FadeoutOverlay>
        </Animated.View>
      )}
    </ThemeMixin>
  );
};

export default Controls;
