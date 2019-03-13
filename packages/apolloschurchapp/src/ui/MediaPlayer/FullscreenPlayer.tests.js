import React from 'react';

import Providers from 'apolloschurchapp/src/Providers';
import { renderWithApolloData } from 'apolloschurchapp/src/utils/testUtils';
import { getFullVisibilityState } from './queries';

import FullscreenPlayer from './FullscreenPlayer';

describe('the FullscreenPlayer component', () => {
  it('should render miniplayer with video', async () => {
    const mocks = [
      {
        request: {
          query: getFullVisibilityState,
        },
        result: {
          data: {
            mediaPlayer: {
              currentTrack: {
                isVideo: true,
              },
              isVisible: true,
              isFullscreen: false,
            },
          },
        },
      },
    ];
    const tree = await renderWithApolloData(
      <Providers mocks={mocks} addTypename={false}>
        <FullscreenPlayer />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render miniplayer with audio', async () => {
    const mocks = [
      {
        request: {
          query: getFullVisibilityState,
        },
        result: {
          data: {
            mediaPlayer: {
              currentTrack: {
                isVideo: false,
              },
              isVisible: true,
              isFullscreen: false,
            },
          },
        },
      },
    ];
    const tree = await renderWithApolloData(
      <Providers mocks={mocks} addTypename={false}>
        <FullscreenPlayer />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render fullscreen', async () => {
    const mocks = [
      {
        request: {
          query: getFullVisibilityState,
        },
        result: {
          data: {
            mediaPlayer: {
              currentTrack: {
                isVideo: false,
              },
              isVisible: true,
              isFullscreen: true,
            },
          },
        },
      },
    ];
    const tree = await renderWithApolloData(
      <Providers mocks={mocks} addTypename={false}>
        <FullscreenPlayer />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
