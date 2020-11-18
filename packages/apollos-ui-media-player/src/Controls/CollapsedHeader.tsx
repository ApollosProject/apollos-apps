import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { H4, styled, ConnectedImage } from '@apollosproject/ui-kit';
import Color from 'color';

import { useNowPlaying } from '../context';

const Image = styled(
  ({ theme }: any) => ({
    width: theme?.sizing?.baseUnit * 1.5,
    borderRadius: theme.sizing.baseUnit / 2,
    marginRight: theme.sizing.baseUnit / 2,
    aspectRatio: 1,
  }),
  'ApollosPlayer.FullscreenPresentation.Header.CoverImage'
)(ConnectedImage);

const Container = styled(
  ({ theme }: { theme: any }) => ({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color(theme?.colors?.primary)
      .fade(theme?.alpha?.low)
      .string(),
    height: '100%',
  }),
  'ApollosPlayer.Controls.CollapsedHeader.Container'
)(SafeAreaView);

const CollapsedHeader: React.FunctionComponent = () => {
  const nowPlaying = useNowPlaying();

  return (
    <Container>
      {nowPlaying?.coverImage ? <Image source={nowPlaying.coverImage} /> : null}

      <H4>{nowPlaying?.presentationProps?.title}</H4>
    </Container>
  );
};

export default CollapsedHeader;
