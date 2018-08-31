import gql from 'graphql-tag';

const getMediaPlayerVisibility = gql`
  query mediaPlayerVisibility {
    mediaPlayer @client {
      isVisible
      isFullscreen
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

const getElapsedTime = gql`
  query {
    mediaPlayer @client {
      progress {
        currentTime
      }
    }
  }
`;

const getProgress = gql`
  query {
    mediaPlayer @client {
      progress {
        currentTime
        duration
      }
    }
  }
`;

const getTotalTime = gql`
  query {
    mediaPlayer @client {
      progress {
        duration
      }
    }
  }
`;

export {
  getMediaPlayerVisibility,
  getFullVisibilityState,
  getControlState,
  getVideoState,
  getElapsedTime,
  getProgress,
  getTotalTime,
};
