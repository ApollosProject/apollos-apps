import { merge } from 'lodash';
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
    mediaPlayerPlayNow(
      parentId: ID,
      mediaSource: VideoMediaSource!,
      posterSources: [ImageMediaSource],
      isVideo: Boolean
      title: String,
      artist: String
    ): Boolean
  }

  type MediaPlayerState {
    currentTrack: MediaPlayerTrack
    isPlaying: Boolean
    isFullscreen: Boolean
    isVisible: Boolean
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
            isFullscreen: (mediaPlayer && mediaPlayer.isFullscreen) || false,
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
  },
};
