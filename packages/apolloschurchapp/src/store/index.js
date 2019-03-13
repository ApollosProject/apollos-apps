import { merge, get } from 'lodash';
import gql from 'graphql-tag';
import { Platform } from 'react-native';
import getLoginState from 'apolloschurchapp/src/auth/getLoginState';
import { track, events } from 'apolloschurchapp/src/analytics';

import { client, CACHE_LOADED } from '../client'; // eslint-disable-line
import {
  getPushPermissions,
  updatePushId,
  getNotificationsEnabled,
} from '../notifications';
import getAuthToken from './getAuthToken';
// TODO: this will require more organization...ie...not keeping everything in one file.
// But this is simple while our needs our small.

export const schema = `
  type Query {
    authToken: String
    mediaPlayer: MediaPlayerState
    isLoggedIn: Boolean
    devicePushId: String
    cacheLoaded: Boolean
    notificationsEnabled: Boolean
  }

  type Mutation {
    logout
    mediaPlayerUpdateState(isPlaying: Boolean, isFullscreen: Boolean, isVisible: Boolean): Boolean
    mediaPlayerSetPlayhead(currentTime: Float): Boolean
    mediaPlayerPlayNow(
      parentId: ID,
      mediaSource: VideoMediaSource!,
      posterSources: [ImageMediaSource],
      title: String,
      artist: String,
      isVideo: Boolean,
    ): Boolean

    cacheMarkLoaded

    handleLogin(authToken: String!)

    updateDevicePushId(pushId: String!)
    updatePushPermissions(enabled: Boolean!)
  }

  type MediaPlayerState {
    currentTrack: MediaPlayerTrack
    isPlaying: Boolean
    isFullscreen: Boolean
    isVisible: Boolean
    currentTime: Float
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
  __typename: 'Query',
  authToken: null,
  cacheLoaded: false,
  pushId: null,
  notificationsEnabled: Platform.OS === 'android',
  mediaPlayer: {
    __typename: 'MediaPlayerState',
    currentTrack: null,
    isPlaying: false,
    isFullscreen: false,
    isVisible: false,
    currentTime: 0,
    showVideo: true,
    muted: false,
  },
};

let trackId = 0;

export const resolvers = {
  Query: {
    isLoggedIn: () => {
      // When logging out, this query returns an error.
      // Rescue the error, and return false.
      try {
        const { authToken } = client.readQuery({ query: getAuthToken });
        return !!authToken;
      } catch (e) {
        return false;
      }
    },
    notificationsEnabled: getPushPermissions,
  },
  Mutation: {
    logout: () => {
      client.resetStore();
      track({ eventName: events.UserLogout });
      return null;
    },

    handleLogin: async (root, { authToken }, { cache }) => {
      try {
        await cache.writeQuery({
          query: getAuthToken,
          data: { authToken },
        });
        await cache.writeQuery({
          query: getLoginState,
          data: { isLoggedIn: true },
        });
        await cache.writeData({
          data: { authToken },
        });

        const { pushId } = cache.readQuery({
          query: gql`
            query {
              pushId
            }
          `,
        });
        if (pushId) {
          updatePushId({ pushId });
        }

        track({ eventName: events.UserLogin });
      } catch (e) {
        throw e.message;
      }

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
      const mediaTrack = merge(
        {
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

      const { mediaPlayer } = cache.readQuery({ query });

      const newMediaPlayerState = {
        __typename: 'MediaPlayerState',
        isPlaying: true,
        isVisible: true,
        isFullscreen: mediaTrack.isVideo
          ? true
          : (mediaPlayer && mediaPlayer.isFullscreen) || false,
        currentTrack: mediaTrack,
        currentTime: 0,
        showVideo: mediaTrack.isVideo,
        muted: false,
      };

      if (
        // if same track
        mediaPlayer &&
        mediaPlayer.currentTrack &&
        mediaPlayer.currentTrack.mediaSource.uri === mediaTrack.mediaSource.uri
      ) {
        // use the same Id
        newMediaPlayerState.currentTrack.id = mediaPlayer.currentTrack.id;
      } else {
        // otherwise reset progress and use new Id
        newMediaPlayerState.currentTrack.id = trackId;
        newMediaPlayerState.progress = null;
        trackId += 1;
      }

      cache.writeData({
        query,
        data: {
          mediaPlayer: newMediaPlayerState,
        },
      });

      track({
        eventName: events.UserPlayedMedia,
        properties: {
          uri: mediaTrack.uri,
          title: mediaTrack.title,
          type: mediaTrack.isVideo ? 'Video' : 'Audio',
        },
      });
      return null;
    },
    mediaPlayerUpdateState: (
      root,
      { isPlaying, isFullscreen, isVisible, showVideo, muted },
      { cache }
    ) => {
      const query = gql`
        query {
          mediaPlayer @client {
            isPlaying
            isFullscreen
            isVisible
            showVideo
            muted
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
            showVideo,
            muted,
            __typename: 'MediaPlayerState',
          }),
        },
      });
      return null;
    },
    mediaPlayerSetPlayhead: (root, { currentTime }, { cache }) => {
      const query = gql`
        query {
          mediaPlayer @client {
            currentTime
          }
        }
      `;
      const { mediaPlayer } = cache.readQuery({ query });
      cache.writeQuery({
        query,
        data: {
          mediaPlayer: {
            __typename: 'MediaPlayerState',
            currentTime:
              currentTime || get(mediaPlayer.progress, 'currentTime') || 0,
          },
        },
      });
      return null;
    },
    updateDevicePushId: (root, { pushId }, { cache }) => {
      const query = gql`
        query {
          pushId @client
        }
      `;
      cache.writeQuery({
        query,
        data: {
          pushId,
        },
      });

      const isLoggedIn = resolvers.Query.isLoggedIn();
      if (isLoggedIn) {
        updatePushId({ pushId });
      }
      return null;
    },
    updatePushPermissions: (root, { enabled }, { cache }) => {
      cache.writeQuery({
        query: getNotificationsEnabled,
        data: {
          notificationsEnabled: enabled,
        },
      });

      return null;
    },

    cacheMarkLoaded: (root, args, { cache }) => {
      cache.writeQuery({
        query: CACHE_LOADED,
        data: {
          cacheLoaded: true,
        },
      });
      const isLoggedIn = resolvers.Query.isLoggedIn();
      const { pushId } = cache.readQuery({
        query: gql`
          query {
            pushId @client
          }
        `,
      });

      if (isLoggedIn && pushId) {
        updatePushId({ pushId });
      }
      return null;
    },
  },
};
