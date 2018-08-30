import gql from 'graphql-tag';

const playVideoMutation = gql`
  mutation playVideo(
    $mediaSource: String!
    $posterSources: String
    $title: String
    $artist: String
    $isVideo: Boolean
  ) {
    mediaPlayerPlayNow(
      mediaSource: $mediaSource
      posterSources: $posterSources
      title: $title
      artist: $artist
      isVideo: $isVideo
    ) @client
  }
`;

const goFullscreen = gql`
  mutation {
    mediaPlayerUpdateState(isFullscreen: true) @client
  }
`;

const play = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: true) @client
  }
`;

const pause = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: false) @client
  }
`;

const dismiss = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: false, isVisible: false) @client
  }
`;

const exitFullscreen = gql`
  mutation {
    mediaPlayerUpdateState(isFullscreen: false) @client
  }
`;

const updateProgress = gql`
  mutation updateProgress(
    $currentTime: Float
    $playableDuration: Float
    $seekableDuration: Float
  ) {
    mediaPlayerNotifyProgress(
      currentTime: $currentTime
      playableDuration: $playableDuration
      seekableDuration: $seekableDuration
    ) @client
  }
`;

const updateDuration = gql`
  mutation updateDuration($duration: Float) {
    mediaPlayerNotifyProgress(duration: $duration) @client
  }
`;

export {
  playVideoMutation,
  goFullscreen,
  play,
  pause,
  dismiss,
  exitFullscreen,
  updateProgress,
  updateDuration,
};
