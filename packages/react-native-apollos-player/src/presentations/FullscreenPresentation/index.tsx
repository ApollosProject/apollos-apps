import * as React from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native';
import {
  ThemeMixin,
  styled,
  withTheme,
  ButtonIcon,
} from '@apollosproject/ui-kit';

import FadeoutOverlay from '../../FadeoutOverlay';
import usePlayer from '../../usePlayer';

import Header from './Header';
import Seeker from './Seeker';

const FooterWrapper = styled(
  {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  'ApollosPlayer.FullscreenPresentation.FooterWrapper'
)(SafeAreaView);

const FooterControls = styled(
  ({ theme }: any) => ({
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme?.sizing?.baseUnit,
  }),
  'ApollosPlayer.FullscreenPresentation.FooterControls'
)(View);

const IconSm = withTheme(
  ({ theme }: any) => ({
    size: theme?.sizing?.baseUnit * 1.25,
    iconPadding: theme?.sizing?.baseUnit,
    fill: theme?.colors?.text?.secondary,
  }),
  'ApollosPlayer.FullscreenPresentation.FullscreenControls.IconSm'
)(ButtonIcon);

const IconMd = withTheme(
  ({ theme }: any) => ({
    size: theme?.sizing?.baseUnit * 2,
    iconPadding: theme?.sizing?.baseUnit,
  }),
  'ApollosPlayer.FullscreenPresentation.FullscreenControls.IconMd'
)(ButtonIcon);

const FullscreenPresentation = () => {
  const {
    isFullscreen,
    setIsFullscreen,
    isPlaying,
    setIsPlaying,
    skip,
  } = usePlayer();

  return (
    <ThemeMixin mixin={{ type: 'dark' }}>
      <StatusBar hidden={isFullscreen} />
      <FadeoutOverlay>
        {isFullscreen ? <Header /> : null}
        <FooterWrapper>
          <FooterControls>
            <IconSm name="chromecast" />
            <IconMd name="skip-back-thirty" onPress={() => skip(-30)} />
            <IconMd
              name={isPlaying ? 'pause' : 'play'}
              onPress={() => setIsPlaying(!isPlaying)}
            />
            <IconMd name="skip-forward-thirty" onPress={() => skip(30)} />
            <IconSm
              name="fullscreen"
              onPress={() => setIsFullscreen(!isFullscreen)}
            />
          </FooterControls>
          <Seeker />
        </FooterWrapper>
      </FadeoutOverlay>
    </ThemeMixin>
  );
};

export default FullscreenPresentation;
