import React from 'react';
import renderer from 'react-test-renderer';

import { client } from 'apolloschurchapp/src/client';
import Providers from 'apolloschurchapp/src/Providers';

import CoverPlayer from './CoverPlayer';

describe('the coverplayer component', () => {
  it('should render video', async () => {
    client.cache.writeData({
      data: {
        mediaPlayer: {
          __typename: 'MediaPlayerState',
          currentTrack: {
            __typename: 'MediaPlayerTrack',
            id: 1,
            mediaSource: { uri: 'some-source' },
            posterSources: [{ uri: 'some-poster-source' }],
            title: 'Some Title',
            artist: 'some artist',
            isVideo: true,
          },
          isVisible: true,
          isFullscreen: false,
          isPlaying: true,
          progress: {
            __typename: 'MediaPlayerProgress',
            currentTime: 12,
            duration: 56,
          },
        },
      },
    });
    const tree = renderer.create(
      <Providers>
        <CoverPlayer />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render audio', async () => {
    client.cache.writeData({
      data: {
        mediaPlayer: {
          __typename: 'MediaPlayerState',
          currentTrack: {
            __typename: 'MediaPlayerTrack',
            id: 1,
            mediaSource: { uri: 'some-source' },
            posterSources: [{ uri: 'some-poster-source' }],
            title: 'Some Title',
            artist: 'some artist',
            isVideo: false,
          },
          isVisible: true,
          isFullscreen: false,
          isPlaying: true,
          progress: {
            __typename: 'MediaPlayerProgress',
            currentTime: 12,
            duration: 56,
          },
        },
      },
    });
    const tree = renderer.create(
      <Providers>
        <CoverPlayer />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render fullscreen', async () => {
    client.cache.writeData({
      data: {
        mediaPlayer: {
          __typename: 'MediaPlayerState',
          currentTrack: {
            __typename: 'MediaPlayerTrack',
            id: 1,
            mediaSource: { uri: 'some-source' },
            posterSources: [{ uri: 'some-poster-source' }],
            title: 'Some Title',
            artist: 'some artist',
            isVideo: false,
          },
          isVisible: true,
          isFullscreen: true,
          isPlaying: true,
          progress: {
            __typename: 'MediaPlayerProgress',
            currentTime: 12,
            duration: 56,
          },
        },
      },
    });
    const tree = renderer.create(
      <Providers>
        <CoverPlayer />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
