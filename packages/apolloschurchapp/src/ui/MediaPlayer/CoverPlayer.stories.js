import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Mutation } from 'react-apollo';

import { ButtonLink } from 'apolloschurchapp/src/ui/Button';
import CenteredView from 'apolloschurchapp/src/ui/CenteredView';

import { playVideoMutation } from './mutations';
import MediaPlayer from '.';

storiesOf('MediaPlayer', module).add('simple', () => (
  <MediaPlayer>
    <CenteredView>
      <Mutation mutation={playVideoMutation}>
        {(play) => (
          <ButtonLink
            onPress={() =>
              play({
                variables: {
                  mediaSource: {
                    uri:
                      'https://s3.amazonaws.com/ns.downloads/newspring/video/newspring_sermons/2017/180513_HolySpirit_06-Message-HIGH.mp4',
                    __typename: 'VideoMediaSource',
                  },
                  posterSources: [
                    {
                      uri:
                        'https://apollosrock.newspring.cc/GetImage.ashx?guid=28ea9e81-09b4-411f-8ad5-741054837823',
                      __typename: 'ImageMediaSource',
                    },
                  ],
                  title: 'The Greatest Evangelist',
                  artist: 'Sermon',
                  isVideo: true,
                },
              })
            }
          >
            Play video
          </ButtonLink>
        )}
      </Mutation>
      <Mutation mutation={playVideoMutation}>
        {(play) => (
          <ButtonLink
            onPress={() =>
              play({
                variables: {
                  mediaSource: {
                    uri:
                      'https://s3.amazonaws.com/ns.downloads/newspring/audio/newspring_sermons/2017/180513_HolySpirit_06-Message-AUDIO.mp3',
                    __typename: 'AudioMediaSource',
                  },
                  posterSources: [
                    {
                      uri:
                        'https://apollosrock.newspring.cc/GetImage.ashx?guid=28ea9e81-09b4-411f-8ad5-741054837823',
                      __typename: 'ImageMediaSource',
                    },
                  ],
                  title: 'The Greatest Evangelist',
                  artist: 'Sermon',
                  isVideo: false,
                },
              })
            }
          >
            Play audio
          </ButtonLink>
        )}
      </Mutation>
    </CenteredView>
  </MediaPlayer>
));
