import gql from 'graphql-tag';

export const getMediaPlayerVisibility = gql`
  query mediaPlayerVisibility {
    mediaPlayer @client {
      isVisible
    }
  }
`;

export const getFullVisibilityState = gql`
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

export const getControlState = gql`
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
