import gql from 'graphql-tag';

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
  goFullscreen,
  play,
  pause,
  dismiss,
  exitFullscreen,
  updateProgress,
  updateDuration,
};
