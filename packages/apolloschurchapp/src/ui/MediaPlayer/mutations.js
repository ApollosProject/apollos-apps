import gql from 'graphql-tag';

export const goFullscreen = gql`
  mutation {
    mediaPlayerUpdateState(isFullscreen: true) @client
  }
`;

export const play = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: true) @client
  }
`;

export const pause = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: false) @client
  }
`;

export const dismiss = gql`
  mutation {
    mediaPlayerUpdateState(isPlaying: false, isVisible: false) @client
  }
`;

export const exitFullscreen = gql`
  mutation {
    mediaPlayerUpdateState(isFullscreen: false) @client
  }
`;
