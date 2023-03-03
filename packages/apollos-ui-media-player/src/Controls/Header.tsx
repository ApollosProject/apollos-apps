import * as React from 'react';
import { SafeAreaView, NativeModules, Platform } from 'react-native';
import {
  H4,
  BodySmall,
  PaddedView,
  styled,
  ConnectedImage,
  ButtonIcon,
  withTheme,
} from '@apollosproject/ui-kit';

import { useNowPlaying, usePlayerControls } from '../context';
import { PictureMode } from '../types';

const Image = styled(
  ({ theme }: any) => ({
    width: theme?.sizing?.baseUnit * 3.5,
    borderRadius: theme.sizing.baseUnit,
    marginBottom: theme.sizing.baseUnit,
    aspectRatio: 1,
  }),
  'ApollosPlayer.FullscreenPresentation.Header.CoverImage'
)(ConnectedImage);

const PiPButton = withTheme(
  ({ theme }: any) => ({
    fill: theme?.colors?.text?.secondary,
    style: {
      paddingVertical: theme?.sizing?.baseUnit / 1.25,
      paddingHorizontal: theme?.sizing?.baseUnit / 1.25,
      borderRadius: 0,
    },
    size: theme?.sizing?.baseUnit * 1.5,
    name: 'picture-in-picture',
  }),
  'ApollosPlayer.FullscreenPresentation.Header.DownButton'
)(ButtonIcon);

const Container = styled(
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  'ApollosPlayer.FullscreenPresentation.Header.Container'
)(SafeAreaView);

const Header: React.FunctionComponent = () => {
  const nowPlaying = useNowPlaying();
  const { setPictureMode, pictureMode } = usePlayerControls();
  const [canPiP, setCanPiP] = React.useState(false);

  const isInPiP = pictureMode === PictureMode.PictureInPicture;

  // Detect iOS PiP support
  React.useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const isPictureInPictureSupported = NativeModules.ApollosPlayer?.isPictureInPictureSupported();
    isPictureInPictureSupported?.then((result: boolean) => {
      setCanPiP(result);
    });
  }, []);

  return (
    <Container>
      <PaddedView>
        {nowPlaying?.coverImage ? (
          <Image source={nowPlaying.coverImage} />
        ) : null}
        {nowPlaying?.presentationProps?.badge
          ? nowPlaying?.presentationProps?.badge
          : null}
        <H4>{nowPlaying?.presentationProps?.title}</H4>
        <BodySmall>{nowPlaying?.presentationProps?.description}</BodySmall>
      </PaddedView>

      {canPiP ? (
        <PiPButton
          onPress={() =>
            setPictureMode(
              isInPiP ? PictureMode.Normal : PictureMode.PictureInPicture
            )
          }
        />
      ) : null}
    </Container>
  );
};

export default Header;
