import { merge, get } from 'lodash';
import gql from 'graphql-tag';
import { client } from '../client'; // eslint-disable-line
// TODO: this will require more organization...ie...not keeping everything in one file.
// But this is simple while our needs our small.

export const schema = `
  type Query {
    authToken: String
    mediaPlayer: MediaPlayerState
  }

  type Mutation {
    logout
    mediaPlayerUpdateState(isPlaying: Boolean, isFullscreen: Boolean, isVisible: Boolean): Boolean
    mediaPlayerNotifyProgress(currentTime: Float, playableDuration: Float, seekableDuration: Float, duration: Float): Boolean
    mediaPlayerPlayNow(
      parentId: ID,
      mediaSource: VideoMediaSource!,
      posterSources: [ImageMediaSource],
      title: String,
      artist: String,
      isVideo: Boolean,
    ): Boolean

  }

  type MediaPlayerState {
    currentTrack: MediaPlayerTrack
    isPlaying: Boolean
    isFullscreen: Boolean
    isVisible: Boolean
    progress: MediaPlayerProgress
  }

  type MediaPlayerProgress {
    currentTime: Float
    playableDuration: Float
    seekableDuration: Float
    duration: Float
  }

  type MediaPlayerTrack {
    id: ID!
    parentId: ID
    mediaSource: VideoMediaSource!
    posterSources: [ImageMediaSource]
    title: String
    artist: String
    isVideo: Boolean
  }
`;

export const defaults = {
  authToken: null,
  mediaPlayer: {
    __typename: 'MediaPlayerState',
    currentTrack: null,
    isPlaying: false,
    isFullscreen: false,
    isVisible: false,
    progress: null,
  },
};

let trackId = 0;

export const resolvers = {
  Mutation: {
    logout: (root, variables, { cache }) => {
      client.resetStore();
      cache.writeData({ data: { authToken: null } });
      return null;
    },
    mediaPlayerPlayNow: (root, trackInfo, { cache }) => {
      const query = gql`
        query {
          mediaPlayer {
            isFullscreen
          }
        }
      `;
      const track = merge(
        {
          id: trackId,
          __typename: 'MediaPlayerTrack',
          parentId: null,
          mediaSource: null,
          posterSources: null,
          title: null,
          artist: null,
          isVideo: false,
        },
        trackInfo
      );
      trackId += 1;

      const { mediaPlayer } = cache.readQuery({ query });

      cache.writeData({
        query,
        data: {
          mediaPlayer: {
            __typename: 'MediaPlayerState',
            isPlaying: true,
            isVisible: true,
            isFullscreen: track.isVideo
              ? true
              : (mediaPlayer && mediaPlayer.isFullscreen) || false,
            currentTrack: track,
          },
        },
      });
      return null;
    },
    mediaPlayerUpdateState: (
      root,
      { isPlaying, isFullscreen, isVisible },
      { cache }
    ) => {
      const query = gql`
        query {
          mediaPlayer @client {
            isPlaying
            isFullscreen
            isVisible
          }
        }
      `;
      const { mediaPlayer } = cache.readQuery({ query });
      cache.writeQuery({
        query,
        data: {
          mediaPlayer: merge(mediaPlayer, {
            isPlaying,
            isFullscreen,
            isVisible,
            __typename: 'MediaPlayerState',
          }),
        },
      });
      return null;
    },
    mediaPlayerNotifyProgress: (
      root,
      { currentTime, playableDuration, seekableDuration, duration },
      { cache }
    ) => {
      const query = gql`
        query {
          mediaPlayer @client {
            progress {
              currentTime
              playableDuration
              seekableDuration
              duration
            }
          }
        }
      `;
      const { mediaPlayer } = cache.readQuery({ query });
      cache.writeQuery({
        query,
        data: {
          mediaPlayer: {
            __typename: 'MediaPlayerState',
            progress: {
              currentTime:
                currentTime || get(mediaPlayer.progress, 'currentTime') || 0,
              playableDuration:
                playableDuration ||
                get(mediaPlayer.progress, 'playableDuration') ||
                0,
              seekableDuration:
                seekableDuration ||
                get(mediaPlayer.progress, 'seekableDuration') ||
                0,
              duration: duration || get(mediaPlayer.progress, 'duration') || 0,
              __typename: 'MediaPlayerProgress',
            },
          },
        },
      });
      return null;
    },
  },
};
