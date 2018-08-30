import React from 'react';
import { storiesOf } from '@storybook/react-native';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { ButtonLink } from '../Button';
import CenteredView from '../CenteredView';
import MediaPlayer from '.';

const playVideo = gql`
  mutation {
    mediaPlayerPlayNow(
      mediaSource: {
        uri: "https://s3.amazonaws.com/ns.downloads/newspring/video/newspring_sermons/2017/180513_HolySpirit_06-Message-HIGH.mp4"
        __typename: "VideoMediaSource"
      }
      posterSources: [
        {
          uri: "https://apollosrock.newspring.cc/GetImage.ashx?guid=28ea9e81-09b4-411f-8ad5-741054837823"
          __typename: "AudioMediaSource"
        }
      ]
      title: "The Greatest Evangelist"
      artist: "Sermon"
      isVideo: true
    ) @client
  }
`;

const playAudio = gql`
  mutation {
    mediaPlayerPlayNow(
      mediaSource: {
        uri: "https://s3.amazonaws.com/ns.downloads/newspring/au…rmons/2017/180513_HolySpirit_06-Message-AUDIO.mp3"
        __typename: "VideoMediaSource"
      }
      posterSources: [
        {
          uri: "https://apollosrock.newspring.cc/GetImage.ashx?guid=28ea9e81-09b4-411f-8ad5-741054837823"
          __typename: "AudioMediaSource"
        }
      ]
      title: "The Greatest Evangelist"
      artist: "Sermon"
      isVideo: false
    ) @client
  }
`;

storiesOf('MediaPlayer', module).add('simple', () => (
  <MediaPlayer>
    <CenteredView>
      <Mutation mutation={playVideo}>
        {(play) => <ButtonLink onPress={() => play()}>Play video</ButtonLink>}
      </Mutation>
      <Mutation mutation={playAudio}>
        {(play) => <ButtonLink onPress={() => play()}>Play audio</ButtonLink>}
      </Mutation>
    </CenteredView>
  </MediaPlayer>
));
