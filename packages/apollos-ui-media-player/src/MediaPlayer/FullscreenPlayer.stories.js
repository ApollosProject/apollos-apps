import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { Mutation } from 'react-apollo';

import {
  ButtonLink,
  CenteredView,
  BackgroundView,
  FlexedView,
} from '@apollosproject/ui-kit';

import MediaPlayerProvider from '../Provider';
import { PLAY_VIDEO } from './mutations';
import MediaPlayer from '.';

storiesOf('ui-media-player/MediaPlayer', module)
  .add('Video', () => (
    <MediaPlayerProvider>
      <BackgroundView>
        <FlexedView>
          <CenteredView>
            <Mutation mutation={PLAY_VIDEO}>
              {(play) => (
                <ButtonLink
                  onPress={() =>
                    play({
                      variables: {
                        mediaSource: {
                          uri:
                            'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
                          __typename: 'VideoMediaSource',
                        },
                        posterSources: [
                          {
                            uri:
                              'https://apollosrock.newspring.cc/GetImage.ashx?guid=28ea9e81-09b4-411f-8ad5-741054837823',
                            __typename: 'ImageMediaSource',
                          },
                        ],
                        title: 'Holy Spirit',
                        artist: 'Fuse Promos',
                        isVideo: true,
                      },
                    })
                  }
                >
                  Play video
                </ButtonLink>
              )}
            </Mutation>
          </CenteredView>
        </FlexedView>
        <MediaPlayer />
      </BackgroundView>
    </MediaPlayerProvider>
  ))
  .add('Audio', () => (
    <MediaPlayerProvider>
      <BackgroundView>
        <FlexedView>
          <CenteredView>
            <Mutation mutation={PLAY_VIDEO}>
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
        </FlexedView>
        <MediaPlayer />
      </BackgroundView>
    </MediaPlayerProvider>
  ))
  .add('Livestream', () => (
    <MediaPlayerProvider>
      <BackgroundView>
        <FlexedView>
          <CenteredView>
            <Mutation mutation={PLAY_VIDEO}>
              {(play) => (
                <ButtonLink
                  onPress={() =>
                    play({
                      variables: {
                        mediaSource: {
                          uri:
                            'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
                          __typename: 'VideoMediaSource',
                        },
                        posterSources: [
                          {
                            uri:
                              'https://apollosrock.newspring.cc/GetImage.ashx?guid=28ea9e81-09b4-411f-8ad5-741054837823',
                            __typename: 'ImageMediaSource',
                          },
                        ],
                        title: 'Live Stream',
                        artist: 'Blender Foundation',
                        isVideo: true,
                      },
                    })
                  }
                >
                  Play livestream
                </ButtonLink>
              )}
            </Mutation>
          </CenteredView>
        </FlexedView>
        <MediaPlayer />
      </BackgroundView>
    </MediaPlayerProvider>
  ));
