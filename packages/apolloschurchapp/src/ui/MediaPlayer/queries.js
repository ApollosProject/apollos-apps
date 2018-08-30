import gql from 'graphql-tag';

const getMediaPlayerVisibility = gql`
  query mediaPlayerVisibility {
    mediaPlayer @client {
      isVisible
    }
  }
`;

const getFullVisibilityState = gql`
  query fullVisibilityState {
    mediaPlayer @client {
      currentTrack {
        isVideo
      }
      isVisible
      isFullscreen
    }
  }
`;

const getControlState = gql`
  query {
    mediaPlayer @client {
      isFullscreen
      isPlaying
      currentTrack {
        id
        title
        artist
        isVideo
      }
    }
  }
`;

const getVideoState = gql`
  query mediaPlayer {
    mediaPlayer @client {
      currentTrack {
        mediaSource {
          uri
        }
        posterSources {
          uri
        }
        id
        isVideo
      }
      isPlaying
    }
  }
`;

export {
  getMediaPlayerVisibility,
  getFullVisibilityState,
  getControlState,
  getVideoState,
};
